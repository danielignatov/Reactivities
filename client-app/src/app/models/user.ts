export interface IUser {
    username: string;
    displayName: string;
    token: string;
    image?: string;
    locale?: string;
}

export interface IUserFormValues {
    email: string;
    password: string;
    displayName?: string;
    username?: string;
    locale?: string;
}

export interface IUserSettingsFormValues {
    locale: string;
    oldPassword: string;
    newPassword: string;
}

export interface IUserForgotPassFormValues {
    email: string;
}

export interface IUserResetPassFormValues {
    resetToken: string;
    password: string;
}