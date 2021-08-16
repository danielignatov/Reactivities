import { action, makeObservable, observable, reaction } from "mobx";
import { RootStore } from "./rootStore";

export default class CommonStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore
        makeObservable(this);
        reaction(
            () => this.token,
            token => {
                //console.log('reaction');
                if (token) {
                    window.localStorage.setItem('jwt', token);
                } else {
                    window.localStorage.removeItem('jwt');
                }
            }
        )
    }

    @observable token: string | null = window.localStorage.getItem('jwt');
    @observable locale: string | null = window.localStorage.getItem('locale');
    @observable appLoaded = false;
    
    @action setToken = (token: string | null) => {
        window.localStorage.setItem('jwt', token!);
        this.token = token;
    }

    @action setLocale = (locale: string) => {
        window.localStorage.setItem('locale', locale);
        this.locale = locale;
    }

    @action setAppLoaded = () => {
        this.appLoaded = true;
    }
}