import { action, makeAutoObservable, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import agent from '../api/agent';
import { IActivity } from '../models/activity';

configure({ enforceActions: 'always' });

class ActivityStore {
    // Observables
    activityRegistry = new Map();
    activity: IActivity | null = null;
    loadingInitial: boolean = false;
    submitting: boolean = false;
    target: string = '';

    @computed get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    constructor() {
        makeAutoObservable(this)
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;

        try {
            const activities = await agent.Activities.list();
            runInAction(() => {
                activities.forEach((activity) => {
                    activity.date = activity.date.split('.')[0];
                    this.activityRegistry.set(activity.id, activity);
                });
            });
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
        } else {
            this.loadingInitial = true;

            try {
                activity = await agent.Activities.details(id);
                runInAction(() => {
                    this.activity = activity;
                })
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
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
            });
        } catch (error) {
            console.error(error);
        } finally {
            runInAction(() => {
                this.submitting = false;
            });
        }
    }

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
            });
        } catch (error) {
            console.error(error);
        } finally {
            runInAction(() => {
                this.submitting = false;
            });
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
    }
}

export default createContext(new ActivityStore())