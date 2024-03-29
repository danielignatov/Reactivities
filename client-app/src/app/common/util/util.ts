import { IActivity, IAttendee } from "../../models/activity";
import { IUser } from "../../models/user";

export const combineDateAndTime = (date: Date, time: Date) => {
    
    const dateString = date.toISOString().split('T')[0];
    const timeString = time.toISOString().split('T')[1];

    return new Date(dateString + 'T' + timeString);
}

export const setActivityProps = (activity: IActivity, user: IUser) => {
    activity.isGoing = activity.attendees.some(
        a => user && a.username === user.username
    );
    activity.isHost = activity.attendees.some(
        a => user && a.username === user.username && a.isHost
    );
    activity.date = new Date(activity.date);
    return activity;
}

export const createAttendee = (user: IUser): IAttendee => {
    return {
        displayName: user.displayName,
        isHost: false,
        username: user.username,
        image: user.image || '/assets/user.png'
    }
}