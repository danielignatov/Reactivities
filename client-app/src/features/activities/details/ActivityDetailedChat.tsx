import { observer } from 'mobx-react-lite';
import React, { Fragment } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { Segment, Header, Form, Button, Comment } from 'semantic-ui-react';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { Form as FinalForm, Field } from 'react-final-form';
import { Link } from 'react-router-dom';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import { combineValidators, isRequired } from 'revalidate';
import { formatDistance } from 'date-fns';
import { useTranslation } from 'react-i18next';



const ActivityDetailedChat = () => {
    const { t } = useTranslation();
    const rootStore = useContext(RootStoreContext);
    const {
        createHubConnection,
        stopHubConnection,
        addComment,
        activity
    } = rootStore.activityStore;
    const { isLoggedIn } = rootStore.userStore;

    const validate = combineValidators({
        body: isRequired({ message: t('activities.details.activitydetailedchat.msgcannotbeempty') })
    })

    useEffect(() => {
        createHubConnection(activity!.id);
        return () => {
            stopHubConnection();
        }
    }, [createHubConnection, stopHubConnection, activity])

    return (
        <Fragment>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{ border: 'none' }}
            >
                <Header>{t('activities.details.activitydetailedchat.chatabouttheevent')}</Header>
            </Segment>
            <Segment attached>
                <Comment.Group>
                    {activity && activity.comments && activity.comments.map((comment) => (
                        <Comment key={comment.id} >
                            <Comment.Avatar src={comment.image || '/assets/user.png'} />
                            <Comment.Content>
                                <Comment.Author as={Link} to={`/profile/${comment.username}`}>{comment.displayName}</Comment.Author>
                                <Comment.Metadata>
                                    <div>{formatDistance(new Date(comment.createdAt), new Date())}</div>
                                </Comment.Metadata>
                                <Comment.Text>{comment.body}</Comment.Text>
                            </Comment.Content>
                        </Comment>
                    ))}
                    
                    <FinalForm
                        validate={validate}
                        onSubmit={addComment}
                        render={({ handleSubmit, invalid, submitting, form }) => (
                            <Form onSubmit={() => handleSubmit()!.then(() => form.reset())}>
                                <Field
                                    name='body'
                                    component={TextAreaInput}
                                    rows={2}
                                    placeholder={t('activities.details.activitydetailedchat.addyourcomment')}
                                />
                                <Button
                                    disabled={!isLoggedIn || invalid || submitting}
                                    content={t('activities.details.activitydetailedchat.addreply')}
                                    labelPosition='left'
                                    icon='edit'
                                    primary
                                    loading={submitting}
                                />
                            </Form>
                        )}
                    />
                </Comment.Group>
            </Segment>
        </Fragment>
    )
}

export default observer(ActivityDetailedChat)