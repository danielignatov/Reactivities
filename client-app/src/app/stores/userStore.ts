import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { history } from "../..";
import agent from "../api/agent";
import { IUser, IUserForgotPassFormValues, IUserFormValues, IUserResetPassFormValues, IUserSettingsFormValues } from "../models/user";
import { RootStore } from "./rootStore";

export default class UserStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    // Observables
    @observable user: IUser | null = null;

    @computed get isLoggedIn() { return !!this.user }

    @action login = async (values: IUserFormValues) => {
        try {
            const user = await agent.User.login(values);
            runInAction(() => {
                this.user = user;
            })
            this.rootStore.commonStore.setToken(user.token);
            user.locale && this.rootStore.commonStore.setLocale(user.locale);
            history.push('/activities');
        } catch (error) {
            throw error;
        }
    }

    @action editSettings = async (values: IUserSettingsFormValues) => {
        try {
            const user = await agent.User.settings(values);
            runInAction(() => {
                this.user = user;
            });

            user.locale && this.rootStore.commonStore.setLocale(user.locale);

            history.push('/');
        } catch (error) {
            throw error;
        }
    }

    @action forgotPassword = async (values: IUserForgotPassFormValues) => {
        try {
            await agent.User.forgotPassword(values);
        } catch (error) {
            throw error;
        }
    }

    @action resetPassword = async (values: IUserResetPassFormValues) => {
        try {
            await agent.User.resetPassword(values);
        } catch (error) {
            throw error;
        }
    }

    @action register = async (values: IUserFormValues) => {
        try {
            const user = await agent.User.register(values);
            //runInAction(() => {
            //    this.user = user;
            //})
            this.rootStore.commonStore.setToken(user.token);
            //this.rootStore.modalStore.closeModal();
            history.push('/');
        } catch (error) {
            throw error;
        }
    }

    @action getUser = async () => {
        try {
            const user = await agent.User.current();

            runInAction(() => {
                this.user = user;
            })
        } catch (error) {
            console.log(error);
        }
    }

    @action logout = () => {
        this.rootStore.commonStore.setToken(null);
        this.user = null;
        history.push('/');
    }
}