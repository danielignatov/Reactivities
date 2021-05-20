export interface IProfile {
    displayName: string,
    username: string,
    bio: string,
    image: string,
    images: IImage[]
}

export interface IImage {
    id: string,
    url: string,
    isMain: boolean
}