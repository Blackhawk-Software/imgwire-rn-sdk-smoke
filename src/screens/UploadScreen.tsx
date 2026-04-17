import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUpload } from '@imgwire/react-native';
import type { SupportedMimeType } from '@imgwire/js';
import {
  ControlButton,
  JsonBlock,
  Row,
  Section,
  StatusText,
} from '../components/Section';
import { hasPublishableApiKey } from '../config';

type SelectedAsset = {
  uri: string;
  name: string;
  type: string;
  width?: number;
  height?: number;
};

type UploadResultState = {
  mode: 'standard' | 'cancelled' | 'invalid';
  imageId: string;
  cdnUrl: string;
} | null;

type UploadMode = 'standard' | 'cancelled' | 'invalid';

function isAbortError(error: unknown) {
  return (
    error instanceof Error &&
    (error.name === 'AbortError' ||
      error.message.toLowerCase().includes('abort'))
  );
}

export function UploadScreen() {
  const [upload, progress] = useUpload();
  const [selectedAsset, setSelectedAsset] = useState<SelectedAsset | null>(
    null,
  );
  const [result, setResult] = useState<UploadResultState>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<
    'idle' | 'uploading' | 'cancelled' | 'success' | 'error'
  >('idle');
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const progressPercent = useMemo(() => {
    if (typeof progress.percent === 'number') {
      return `${Math.round(progress.percent)}%`;
    }
    return progress.total
      ? `${progress.loaded}/${progress.total}`
      : `${progress.loaded} bytes`;
  }, [progress.loaded, progress.percent, progress.total]);

  function normalizeMimeType(value: string): SupportedMimeType | undefined {
    const supportedMimeTypes: SupportedMimeType[] = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/gif',
    ];

    return supportedMimeTypes.includes(value as SupportedMimeType)
      ? (value as SupportedMimeType)
      : undefined;
  }

  async function pickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Media library permission is required to test uploads.');
      setUploadState('error');
      return;
    }

    const response = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: false,
    });

    if (response.canceled) {
      return;
    }

    const asset = response.assets[0];
    setSelectedAsset({
      uri: asset.uri,
      name: asset.fileName ?? `imgwire-smoke-${Date.now()}.jpg`,
      type: asset.mimeType ?? 'image/jpeg',
      width: asset.width,
      height: asset.height,
    });
    setError(null);
    setUploadState('idle');
    setResult(null);
  }

  async function startUpload(mode: UploadMode, fileOverride?: SelectedAsset) {
    const file = fileOverride ?? selectedAsset;
    if (!file) {
      setError('Pick an image before starting an upload.');
      setUploadState('error');
      return;
    }

    const controller = mode === 'cancelled' ? new AbortController() : null;

    try {
      console.log('Imgwire upload start', { mode, file });
      setAbortController(controller);
      setError(null);
      setResult(null);
      setUploadState('uploading');

      const uploaded = await upload(
        {
          uri: file.uri,
          name: file.name,
          type: file.type,
        },
        {
          fileName: file.name,
          mimeType: normalizeMimeType(file.type),
          signal: controller?.signal,
        },
      );

      console.log('Imgwire upload success', {
        mode,
        id: uploaded.id,
        cdnUrl: uploaded.cdn_url,
      });

      setResult({
        mode,
        imageId: uploaded.id,
        cdnUrl: uploaded.cdn_url,
      });
      setUploadState('success');
    } catch (caughtError) {
      if (isAbortError(caughtError)) {
        console.log('Imgwire upload cancelled', { mode, file });
        setError('Upload cancelled via AbortController.');
        setUploadState('cancelled');
      } else {
        console.log('Imgwire upload error', caughtError);
        setError(
          caughtError instanceof Error ? caughtError.message : 'Upload failed.',
        );
        setUploadState('error');
      }
    } finally {
      setAbortController(null);
    }
  }

  function cancelUpload() {
    abortController?.abort();
  }

  async function uploadInvalidUri() {
    await startUpload('invalid', {
      uri: 'file:///imgwire-invalid-upload.jpg',
      name: 'imgwire-invalid-upload.jpg',
      type: 'image/jpeg',
    });
  }

  return (
    <Section
      title="useUpload"
      subtitle="Picks a local photo, uploads it through the published hook, shows progress, and tests abort and invalid-URI error handling."
    >
      <StatusText
        label="Configured"
        value={
          hasPublishableApiKey
            ? 'publishable key present'
            : 'set `EXPO_PUBLIC_IMGWIRE_API_KEY` first'
        }
        tone={hasPublishableApiKey ? 'success' : 'warning'}
      />
      <Row>
        <ControlButton label="Pick image" onPress={pickImage} />
        <ControlButton
          label="Upload"
          onPress={() => startUpload('standard')}
          disabled={!selectedAsset || uploadState === 'uploading'}
        />
        <ControlButton
          label="Upload + cancel"
          onPress={() => startUpload('cancelled')}
          disabled={!selectedAsset || uploadState === 'uploading'}
        />
        <ControlButton
          label="Cancel"
          onPress={cancelUpload}
          disabled={!abortController}
          tone="danger"
        />
        <ControlButton
          label="Invalid URI"
          onPress={uploadInvalidUri}
          disabled={uploadState === 'uploading'}
          tone="danger"
        />
      </Row>
      <StatusText
        label="uploadState"
        value={uploadState}
        tone={
          uploadState === 'success'
            ? 'success'
            : uploadState === 'error'
              ? 'error'
              : uploadState === 'cancelled'
                ? 'warning'
                : 'default'
        }
      />
      <StatusText label="progress" value={progressPercent} />
      <StatusText
        label="error"
        value={error ?? 'none'}
        tone={error ? 'error' : 'default'}
      />
      {uploadState === 'uploading' ? (
        <ActivityIndicator color="#102542" />
      ) : null}
      {selectedAsset ? (
        <View style={styles.assetCard}>
          <Text style={styles.assetTitle}>Selected asset</Text>
          <Image
            source={{ uri: selectedAsset.uri }}
            style={styles.preview}
            resizeMode="cover"
          />
          <JsonBlock title="Picker asset" value={selectedAsset} />
        </View>
      ) : null}
      {result ? (
        <View style={styles.assetCard}>
          <Text style={styles.assetTitle}>Uploaded image</Text>
          <Image
            source={{ uri: result.cdnUrl }}
            style={styles.preview}
            resizeMode="cover"
          />
          <JsonBlock title="Upload result" value={result} />
        </View>
      ) : null}
      <JsonBlock
        title="Progress payload"
        value={{
          progress,
          platform: Platform.OS,
          hasAbortController: Boolean(abortController),
        }}
      />
    </Section>
  );
}

const styles = StyleSheet.create({
  assetCard: {
    gap: 10,
  },
  assetTitle: {
    color: '#102542',
    fontSize: 15,
    fontWeight: '700',
  },
  preview: {
    backgroundColor: '#d9e2f2',
    borderRadius: 12,
    height: 220,
    width: '100%',
  },
});
