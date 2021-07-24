import { observable, action, runInAction, makeObservable, computed, reaction } from 'mobx'
import { toast } from 'react-toastify';
import agent from '../api/agent';
import { IImage, IProfile, IUserActivity } from '../models/profile';
import { RootStore } from './rootStore'

export default class ProfileStore {
    rootStore: RootStore
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;

        makeObservable(this);

        reaction (
            () => this.activeTab,
            activeTab => {
                this.followings = [];

                if (activeTab === 3 || activeTab === 4) {
                    const predicate = activeTab === 3 ? 'followers' : 'following';
                    this.loadFollowings(predicate);
                }
            }
        );
    }

    @observable profile: IProfile | null = null;
    @observable loadingProfile: boolean = false;
    @observable uploadingImage: boolean = false;
    @observable submitting: boolean = false;
    @observable loading: boolean = false;
    @observable followings: IProfile[] = [];
    @observable activeTab: number = 0;
    @observable userActivities: IUserActivity[] = [];
    @observable loadingActivities: boolean = false;

    @computed get isCurrentUser() {
        if (this.rootStore.userStore.user && this.profile) {
            return this.rootStore.userStore.user.username === this.profile.username;
        }

        return false;
    }

    @action loadUserActivities = async (username: string, predicate?: string) => {
        this.loadingActivities = true; 
        try {
            const activities = await agent.Profiles.listActivities(username, predicate!);
            runInAction(() => {
                this.userActivities = activities;
                this.loadingActivities = false;
            });
        } catch (error) {
            runInAction(() => {
                toast.error('Problem loading user activities');
                this.loadingActivities = false;
            })
            console.log(error);
        }
    }

    @action setActiveTab = (activeIndex: number) => {
        this.activeTab = activeIndex;
    }

    @action loadProfile = async (username: string) => {
        this.loadingProfile = true;

        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            })
            return profile;
        } catch (error) {
            runInAction(() => {
                this.loadingProfile = false;
            })
            console.log(error);
        }
    }

    @action uploadImage = async (file: Blob) => {
        this.uploadingImage = true;

        try {
            const image = await agent.Profiles.uploadImage(file);
            runInAction(() => {
                if (this.profile) {
                    this.profile.images.push(image);
                    if (image.isMain && this.rootStore.userStore.user) {
                        this.rootStore.userStore.user.image = image.url;
                        this.profile.image = image.url;
                    }
                    this.uploadingImage = false;
                }
            })
        } catch (error) {
            console.log(error);
            toast.error('Problem uploading image');
            runInAction(() => {
                this.uploadingImage = false;
            })
        }
    }

    @action setMainImage = async (image: IImage) => {
        this.loading = true;
        try {
            await agent.Profiles.setMainImage(image.id);
            runInAction(() => {
                this.rootStore.userStore.user!.image = image.url;
                this.profile!.images.find(x => x.isMain)!.isMain = false;
                this.profile!.images.find(x => x.id === image.id)!.isMain = true;
                this.profile!.image = image.url;
                this.loading = false;
            });
        } catch (error) {
            toast.error('Problem setting photo as main');
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    @action deleteImage = async (image: IImage) => {
        this.loading = true;
        try {
            await agent.Profiles.deleteImage(image.id);
            runInAction(() => {
                this.profile!.images = this.profile!.images.filter(x => x.id !== image.id);
                this.loading = false;
            });
        } catch (error) {
            toast.error('Problem deleting the photo');
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    @action editProfile = async (profile: Partial<IProfile>) => {
        this.submitting = true;
        try {
            await agent.Profiles.update(profile);
            runInAction(() => {
                this.rootStore.userStore.user!.displayName = profile.displayName!;
                this.profile!.displayName = profile.displayName!;
                this.profile!.bio = profile.bio!;
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

    @action follow = async (username: string) => {
        this.loading = true;
        try {
            await agent.Profiles.follow(username);
            runInAction(() => {
                this.profile!.following = true;
                this.profile!.followersCount++;
                this.loading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            });
            toast.error('Problem following user');
            console.error(error);
        }
    }

    @action unfollow = async (username: string) => {
        this.loading = true;
        try {
            await agent.Profiles.unfollow(username);
            runInAction(() => {
                this.profile!.following = false;
                this.profile!.followersCount--;
                this.loading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            });
            toast.error('Problem unfollowing user');
            console.error(error);
        }
    }

    @action loadFollowings = async (predicate: string) => {
        this.loading = true;
        try {
            const profiles = await agent.Profiles.listFollowings(this.profile!.username, predicate);
            runInAction(() => {
                this.followings = profiles;
                this.loading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            });
            toast.error('Problem loading followings');
            console.error(error);
        }
    }
}