import { observable, action, runInAction, makeObservable, computed } from 'mobx'
import { toast } from 'react-toastify';
import agent from '../api/agent';
import { IImage, IProfile } from '../models/profile';
import { RootStore } from './rootStore'

export default class ProfileStore {
    rootStore: RootStore
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    @observable profile: IProfile | null = null;
    @observable loadingProfile: boolean = false;
    @observable uploadingImage: boolean = false;
    @observable loading: boolean = false;

    @computed get isCurrentUser() {
        if (this.rootStore.userStore.user && this.profile) {
            return this.rootStore.userStore.user.username === this.profile.username;
        }

        return false;
    }

    @action loadProfile = async (username: string) => {
        this.loadingProfile = true;

        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            })
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
}