import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { action, computed, runInAction, observable, makeObservable, reaction, toJS } from 'mobx';
import { SyntheticEvent } from 'react';
import { toast } from 'react-toastify';
import agent from '../api/agent';
import { createAttendee, setActivityProps } from '../common/util/util';
import { IActivity } from '../models/activity';
import { RootStore } from './rootStore';

const LIMIT = 2;

export default class ActivityStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);

        reaction (
            () => this.predicate.keys(),
            () => {
                this.page = 0;
                this.activityRegistry.clear();
                this.loadActivities();
            });
    }

    // Observables
    @observable activityRegistry = new Map();
    @observable activity: IActivity | null = null;
    @observable loadingInitial: boolean = false;
    @observable submitting: boolean = false;
    @observable target: string = '';
    @observable loading: boolean = false;
    @observable.ref hubConnection: HubConnection | null = null;
    @observable activityCount: number = 0;
    @observable page: number = 0;
    @observable predicate = new Map();

    @computed get totalPages() {
        return Math.ceil(this.activityCount / LIMIT);
    }

    @computed get axiosParams() {
        const params = new URLSearchParams();
        params.append('limit', String(LIMIT));
        params.append('offset', `${this.page ? this.page * LIMIT : 0}`);

        this.predicate.forEach((value, key) => {
            if (key === 'startDate'){
                params.append(key, value.toISOString());
            } else {
                params.append(key, value);
            }
        });

        return params;
    }

    @action setPredicate = (predicate: string, value: string | Date) => {
        this.predicate.clear();

        if (predicate !== 'all') {
            this.predicate.set(predicate, value);
        }
    }

    @action setPage = (page: number) => {
        this.page = page;
    }

    @action createHubConnection = (activityId: string) => {
        this.hubConnection = new HubConnectionBuilder().withUrl(process.env.REACT_APP_API_CHAT_URL!, {
            accessTokenFactory: () => this.rootStore.commonStore.token!
        }).withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        this.hubConnection
            .start()
            .then(() => console.log(this.hubConnection!.state))
            .then(() => {
                console.log('attempting to join group');
                if (this.hubConnection!.state === 'Connected') {
                    this.hubConnection?.invoke('AddToGroup', activityId);
                }
            })
            .catch(error => console.log('Error establish connection: ', error));

        this.hubConnection.on('ReceiveComment', comment => {
            runInAction(() => {
                this.activity!.comments.push(comment);
            })
        })
    }

    @action stopHubConnection = () => {
        if (this.hubConnection?.state === "Connected") {
            this.hubConnection!
                .invoke('RemoveFromGroup', this.activity!.id)
                .then(() => {
                    this.hubConnection!.stop();
                })
                .then(() => {
                    console.log('Connection stopped');
                })
                .catch(error => console.log(error));
        }
    }

    @action addComment = async (values: any) => {
        values.activityId = this.activity!.id;
        values.createdAt = new Date();
        values.image = this.rootStore.userStore.user!.image;
        try {
            await this.hubConnection!.invoke('SendComment', values);
        } catch (error) {
            console.log(error);
        }
    }

    @computed get activitiesByDate() {
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
    }

    groupActivitiesByDate(activities: IActivity[]) {
        const sortedActivities = activities.sort(
            (a, b) => a.date.getTime() - b.date.getTime()
        )

        return Object.entries(sortedActivities.reduce((activities, activity) => {
            const date = activity.date.toISOString().split('T')[0];

            activities[date] = activities[date] ? [...activities[date], activity] : [activity];

            return activities;
        }, {} as { [key: string]: IActivity[] }));
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;

        try {
            const activitiesEnvelope = await agent.Activities.list(this.axiosParams);
            const { activities, activityCount } = activitiesEnvelope;
            runInAction(() => {
                activities.forEach((activity) => {
                    setActivityProps(activity, this.rootStore.userStore.user!);
                    this.activityRegistry.set(activity.id, activity);
                });
                this.activityCount = activityCount;
            });
            //console.log(this.groupActivitiesByDate(activities));
        } catch (error) {
            console.error(error);
        } finally {
            runInAction(() => {
                this.loadingInitial = false;
            });
        }
    }

    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);

        if (activity) {
            this.activity = activity;
            return toJS(activity);
        } else {
            this.loadingInitial = true;

            try {
                activity = await agent.Activities.details(id);
                runInAction(() => {
                    setActivityProps(activity, this.rootStore.userStore.user!);
                    this.activity = activity;
                    this.activityRegistry.set(activity.id, activity);
                    this.loadingInitial = false;
                })
                return activity;
            } catch (error) {
                console.error(error);
            } finally {
                runInAction(() => {
                    this.loadingInitial = false;
                })
            }
        }
    }

    @action clearActivity = () => {
        this.activity = null;
    }

    getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            const attendee = createAttendee(this.rootStore.userStore.user!);
            attendee.isHost = true;
            let attendees = [];
            attendees.push(attendee);
            activity.attendees = attendees;
            activity.isHost = true;
            activity.comments = [];
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.submitting = false;
            });
        } catch (error) {
            runInAction(() => {
                this.submitting = false;
            });
            toast.error('Problem submitting data');
            console.error(error);
        }
    }

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
                this.submitting = false;
            });
        } catch (error) {
            runInAction(() => {
                this.submitting = false;
            });
            toast.error('Problem submitting data');
            console.error(error);
        }
    }

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
            });
        } catch (error) {
            console.error(error);
        } finally {
            runInAction(() => {
                this.submitting = false;
                this.target = '';
            });
        }
    };

    @action attendActivity = async () => {
        const attendee = createAttendee(this.rootStore.userStore.user!);
        this.loading = true;
        try {
            await agent.Activities.attend(this.activity!.id);
            runInAction(() => {
                if (this.activity) {
                    this.activity.attendees.push(attendee);
                    this.activity.isGoing = true;
                    this.activityRegistry.set(this.activity.id, this.activity);
                    this.loading = false;
                }
            });
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            });

            toast.error('Problem signing up to activity');
        }
    };

    @action cancelAttendance = async () => {
        this.loading = true;
        try {
            await agent.Activities.unattend(this.activity!.id);
            runInAction(() => {
                if (this.activity) {
                    this.activity.attendees =
                        this.activity.attendees.filter(a => a.username !== this.rootStore.userStore.user!.username);
                    this.activity.isGoing = false;
                    this.activityRegistry.set(this.activity.id, this.activity);
                    this.loading = false;
                }
            });
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            });

            toast.error('Problem cancelling attendance');
        }
    };
}

//export default createContext(new ActivityStore());