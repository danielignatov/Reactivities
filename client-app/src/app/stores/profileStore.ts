import { observable, action, runInAction, makeObservable, computed } from 'mobx'
import agent from '../api/agent';
import { IProfile } from '../models/profile';
import { RootStore } from './rootStore'

export default class ProfileStore {
    rootStore: RootStore
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    @observable profile: IProfile | null = null;
    @observable loadingProfile: boolean = false;

    @computed get isCurrentUser() {
        if (this.rootStore.userStore.user && this.profile){
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
}