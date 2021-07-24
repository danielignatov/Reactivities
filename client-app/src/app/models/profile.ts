export interface IProfile {
    displayName: string,
    username: string,
    bio: string,
    image: string,
    following: boolean,
    followersCount: number,
    followingCount: number,
    images: IImage[]
}

export interface IImage {
    id: string,
    url: string,
    isMain: boolean
}

export interface IUserActivity {
    id: string,
    title: string;
    category: string;
    date: Date;
}

export interface IProfileFormValues extends Partial<IProfile> {

}

export class ProfileFormValues implements IProfileFormValues {
    displayName: string = '';
    username: string = '';
    bio: string = '';
    image: string = '';
    images: IImage[] = [];

    constructor(init?: IProfileFormValues) {
        Object.assign(this, init);
    }
}