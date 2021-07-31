import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Header, Tab, Image, Button, Grid } from 'semantic-ui-react';
import ImageUploadWidget from '../../app/common/imageUpload/ImageUploadWidget';
import { RootStoreContext } from '../../app/stores/rootStore';

const ProfilePhotos = () => {
    const { t } = useTranslation();
    const rootStore = useContext(RootStoreContext);
    const { profile, isCurrentUser, uploadImage, uploadingImage, setMainImage, loading, deleteImage } = rootStore.profileStore;
    const [addPhotoMode, setAddPhotoMode] = useState(false);

    const [target, setTarget] = useState<string | undefined>(undefined);
    const [deleteTarget, setDeleteTarget] = useState<string | undefined>(undefined);

    const handleUploadImage = (image: Blob) => {
        uploadImage(image).then(() => setAddPhotoMode(false));
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16} style={{ paddingBottom: 0 }} >
                    <Header floated='left' icon='image' content={t('profiles.profilephotos.photos')} />
                    {isCurrentUser &&
                        <Button floated='right' basic content={addPhotoMode ? t('common.cancel') : t('profiles.profilephotos.addphoto')} onClick={() => setAddPhotoMode(!addPhotoMode)} />
                    }
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <ImageUploadWidget uploadImage={handleUploadImage} loading={uploadingImage} />
                    ) : (
                        <Card.Group itemsPerRow={5}>
                            {profile && profile.images.map((image) => (
                                <Card key={image.id}>
                                    <Image src={image.url} />
                                    {isCurrentUser && 
                                    <Button.Group fluid widths={2}>
                                        <Button 
                                        name={image.id}
                                        basic 
                                        positive 
                                        content={t('profiles.profilephotos.main')} 
                                        onClick={(event) => {
                                            setMainImage(image);
                                            setTarget(event.currentTarget.name);
                                        }} 
                                        loading={loading && target === image.id } 
                                        disabled={image.isMain}
                                        />
                                        <Button 
                                        name={image.id}
                                        basic 
                                        negative 
                                        icon='trash' 
                                        onClick={(event) => {
                                            deleteImage(image);
                                            setDeleteTarget(event.currentTarget.name);
                                        }} 
                                        loading={loading && deleteTarget === image.id } 
                                        disabled={image.isMain}
                                        />
                                    </Button.Group>
                                    }
                                </Card>
                            ))}
                        </Card.Group>
                    )}

                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}

export default observer(ProfilePhotos)