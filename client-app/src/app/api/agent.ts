import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { IActivitiesEnvelope, IActivity } from '../models/activity';
import { history } from '../..';
import { toast } from 'react-toastify';
import { IUser, IUserForgotPassFormValues, IUserFormValues, IUserResetPassFormValues, IUserSettingsFormValues } from '../models/user';
import { IImage, IProfile } from '../models/profile';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use((config: AxiosRequestConfig) => {
    const token = window.localStorage.getItem('jwt');

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
}, error => {
    return Promise.reject(error);
})

axios.interceptors.response.use(undefined, error => {
    if (error.message === 'Network Error' && !error.response) {
        toast.error('No connection to the server!');
    }

    const { status, data, config, headers } = error.response;

    if (status === 404) {
        history.push('/notfound');
    }

    if (status === 401 && headers['www-authenticate'].includes('The token expired')) {
        window.localStorage.removeItem('jwt');
        history.push('/');
        toast.info('Your session has expired, please login again.');
    }

    if (status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id')) {
        history.push('/notfound');
    }

    if (status === 500) {
        toast.error('Server error!');
    }

    throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

//const sleep = (ms: number) => (response: AxiosResponse) =>
//    new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms))

const requests = {
    //.then(sleep(1000)) to test with delay
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    del: (url: string) => axios.delete(url).then(responseBody),
    postForm: (url: string, file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post(url, formData, {
            headers: { 'Content-type': 'multipart/form-data' }
        }).then(responseBody);
    }
}

const Activities = {
    list: (params: URLSearchParams): Promise<IActivitiesEnvelope> => axios.get(`/activities`, { params }).then(responseBody),
    details: (id: string) => requests.get(`/activities/${id}`),
    create: (activity: IActivity) => requests.post('/activities', activity),
    update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`),
    attend: (id: string) => requests.post(`/activities/${id}/attend`, {}),
    unattend: (id: string) => requests.del(`/activities/${id}/attend`)
}

const User = {
    current: (): Promise<IUser> => requests.get('/user'),
    login: (user: IUserFormValues): Promise<IUser> => requests.post('/user/login', user),
    register: (user: IUserFormValues): Promise<IUser> => requests.post('/user/register', user),
    settings: (user: IUserSettingsFormValues): Promise<IUser> => requests.post('/user/settings', user),
    forgotPassword: (values: IUserForgotPassFormValues) => requests.post('/user/forgotPassword', values),
    resetPassword: (values: IUserResetPassFormValues) => requests.post('/user/resetPassword', values)
}

const Profiles = {
    get: (username: string): Promise<IProfile> => requests.get(`/profiles/${username}`),
    update: (profile: Partial<IProfile>) => requests.put(`/profiles`, profile),
    uploadImage: (image: Blob): Promise<IImage> => requests.postForm(`/images`, image),
    setMainImage: (id: string) => requests.post(`/images/${id}/setMain`, {}),
    deleteImage: (id: string) => requests.del(`/images/${id}`),
    follow: (username: string) => requests.post(`/profiles/${username}/follow`, {}),
    unfollow: (username: string) => requests.del(`/profiles/${username}/unfollow`),
    listFollowings: (username: string, predicate: string) => requests.get(`/profiles/${username}/follow?predicate=${predicate}`),
    listActivities: (username: string, predicate: string) => requests.get(`/profiles/${username}/activities?predicate=${predicate}`)
}

const agent = {
    Activities,
    User,
    Profiles
}

export default agent;