import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useFetchImage } from '@imgwire/react-native';
import {
  ControlButton,
  JsonBlock,
  Row,
  Section,
  StatusText,
} from '../components/Section';
import { IMGWIRE_CONFIG, hasImageIdConfig } from '../config';

export function FetchImageScreen() {
  const [mode, setMode] = useState<'valid' | 'invalid'>('valid');
  const [retryKey, setRetryKey] = useState(0);

  const selectedId =
    mode === 'valid' && hasImageIdConfig
      ? IMGWIRE_CONFIG.imageId
      : IMGWIRE_CONFIG.invalidImageId;

  return (
    <Section
      title="useFetchImage"
      subtitle="Shows success, failure, and retry/remount behavior from the published hook."
    >
      <Row>
        <ControlButton
          label="Valid ID"
          onPress={() => setMode('valid')}
          disabled={mode === 'valid'}
        />
        <ControlButton
          label="Invalid ID"
          onPress={() => setMode('invalid')}
          disabled={mode === 'invalid'}
        />
        <ControlButton
          label="Retry hook"
          onPress={() => setRetryKey((current) => current + 1)}
        />
      </Row>
      <FetchImageState
        key={`${mode}:${retryKey}:${selectedId}`}
        imageId={selectedId}
        mode={mode}
      />
    </Section>
  );
}

function FetchImageState({
  imageId,
  mode,
}: {
  imageId: string;
  mode: 'valid' | 'invalid';
}) {
  const state = useFetchImage(imageId);

  useEffect(() => {
    if (state.data) {
      console.log('useFetchImage success', {
        mode,
        id: state.data.id,
        cdnUrl: state.data.cdn_url,
      });
    }
  }, [mode, state.data]);

  useEffect(() => {
    if (state.error) {
      console.log('useFetchImage error', {
        mode,
        imageId,
        message: state.error.message,
      });
    }
  }, [imageId, mode, state.error]);

  return (
    <>
      <StatusText
        label="requestedId"
        value={imageId}
        tone={mode === 'invalid' ? 'warning' : 'default'}
      />
      <StatusText label="isLoading" value={String(state.isLoading)} />
      <StatusText
        label="error"
        value={state.error?.message ?? 'none'}
        tone={state.error ? 'error' : 'default'}
      />
      {state.isLoading ? <ActivityIndicator color="#102542" /> : null}
      <JsonBlock
        title="Hook output"
        value={{
          requestedId: imageId,
          isLoading: state.isLoading,
          error: state.error?.message ?? null,
          data: state.data
            ? {
                id: state.data.id,
                cdn_url: state.data.cdn_url,
                status: state.data.status,
                width: state.data.width,
                height: state.data.height,
              }
            : null,
        }}
      />
    </>
  );
}
