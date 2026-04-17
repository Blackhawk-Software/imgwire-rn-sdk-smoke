import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Image as ImgwireImage, useFetchImage } from '@imgwire/react-native';
import {
  JsonBlock,
  Section,
  SdkErrorBoundary,
  StatusText,
} from '../components/Section';
import { IMGWIRE_CONFIG, hasImageIdConfig } from '../config';

export function ImageByIdScreen() {
  const fetchState = useFetchImage(
    hasImageIdConfig ? IMGWIRE_CONFIG.imageId : '',
  );

  useEffect(() => {
    if (fetchState.data) {
      console.log('Image by ID fetch success', {
        id: fetchState.data.id,
        cdnUrl: fetchState.data.cdn_url,
      });
    }
  }, [fetchState.data]);

  useEffect(() => {
    if (fetchState.error) {
      console.log('Image by ID fetch error', fetchState.error);
    }
  }, [fetchState.error]);

  return (
    <Section
      title="Image by ID"
      subtitle="Uses a known Imgwire image ID, shows loading metadata, and renders once the fetch resolves."
    >
      <StatusText
        label="Configured"
        value={
          hasImageIdConfig
            ? IMGWIRE_CONFIG.imageId
            : 'set `EXPO_PUBLIC_IMGWIRE_IMAGE_ID` first'
        }
        tone={hasImageIdConfig ? 'success' : 'warning'}
      />
      <StatusText label="isLoading" value={String(fetchState.isLoading)} />
      <StatusText
        label="error"
        value={fetchState.error?.message ?? 'none'}
        tone={fetchState.error ? 'error' : 'default'}
      />
      {fetchState.isLoading ? <ActivityIndicator color="#102542" /> : null}
      <SdkErrorBoundary fallbackTitle="Image by ID render failed">
        {hasImageIdConfig ? (
          <ImgwireImage
            id={IMGWIRE_CONFIG.imageId}
            width={300}
            height={200}
            quality={75}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Placeholder />
        )}
      </SdkErrorBoundary>
      <JsonBlock
        title="Fetched image metadata"
        value={{
          data: fetchState.data
            ? {
                id: fetchState.data.id,
                cdn_url: fetchState.data.cdn_url,
                width: fetchState.data.width,
                height: fetchState.data.height,
                status: fetchState.data.status,
              }
            : null,
          isLoading: fetchState.isLoading,
          error: fetchState.error?.message ?? null,
        }}
      />
    </Section>
  );
}

function Placeholder() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>
        Add a valid `imageId` to exercise this section.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    alignSelf: 'center',
    backgroundColor: '#d9e2f2',
    borderRadius: 12,
    width: 300,
    height: 200,
  },
  placeholder: {
    alignItems: 'center',
    backgroundColor: '#eef2f8',
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 180,
    padding: 16,
  },
  placeholderText: {
    color: '#51607a',
    textAlign: 'center',
  },
});
