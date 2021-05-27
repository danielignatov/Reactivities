import React, { Fragment, useEffect, useState } from 'react';
import { Header, Grid, Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import ImageWidgetDropzone from './ImageWidgetDropzone';
import ImageWidgetCropper from './ImageWidgetCropper';
//import { loadavg } from 'os';

interface IProps {
  loading: boolean;
  uploadImage: (file: Blob) => void;
}

const ImageUploadWidget: React.FC<IProps> = ({uploadImage, loading}) => {
  const [files, setFiles] = useState<any>([]);
  const [image, setImage] = useState<Blob | null>(null);

  useEffect(() => {
    return () => {
      files.forEach((file: any) => URL.revokeObjectURL(file.preview))
    }
  })

  return (
    <Fragment>
      <Grid>
        <Grid.Row />
        <Grid.Column width={4}>
          <Header color='teal' sub content='Step 1 - Add Image' />
          <ImageWidgetDropzone setFiles={setFiles} />
        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color='teal' content='Step 2 - Resize image' />
          {files.length > 0 &&
            <ImageWidgetCropper setImage={setImage} imagePreview={files[0].preview} />
          }

        </Grid.Column>
        <Grid.Column width={1} />
        <Grid.Column width={4}>
          <Header sub color='teal' content='Step 3 - Preview & Upload' />
          {files.length > 0 &&
            <Fragment>
              <div className='img-preview' style={{ minHeight: '200px', overflow: 'hidden' }} />
              <Button.Group widths={2} >
                <Button positive icon='check' loading={loading} onClick={() => uploadImage(image!)} />
                <Button icon='close' disable={loading} onClick={() => setFiles([])} />
              </Button.Group>
            </Fragment>

          }
        </Grid.Column>
      </Grid>
    </Fragment>
  );
}

export default observer(ImageUploadWidget);
