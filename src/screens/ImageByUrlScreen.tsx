import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image as ImgwireImage } from '@imgwire/react-native';
import {
  Section,
  JsonBlock,
  SdkErrorBoundary,
  StatusText,
} from '../components/Section';
import { IMGWIRE_CONFIG, hasImageUrlConfig } from '../config';

export function ImageByUrlScreen() {
  const directProps = {
    url: IMGWIRE_CONFIG.imageUrl,
    style: styles.image,
    resizeMode: 'cover' as const,
  };

  const transformedProps = {
    url: IMGWIRE_CONFIG.imageUrl,
    width: 320,
    height: 180,
    format: 'webp' as const,
    quality: 70,
    style: styles.image,
    resizeMode: 'cover' as const,
  };

  return (
    <Section
      title="Image by URL"
      subtitle="Renders the SDK image component directly from a known good CDN URL and applies visible transforms."
    >
      <StatusText
        label="Configured"
        value={
          hasImageUrlConfig
            ? 'yes'
            : 'set `EXPO_PUBLIC_IMGWIRE_IMAGE_URL` first'
        }
        tone={hasImageUrlConfig ? 'success' : 'warning'}
      />
      <View style={styles.stack}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Original URL</Text>
          <SdkErrorBoundary fallbackTitle="Direct URL render failed">
            {hasImageUrlConfig ? (
              <ImgwireImage {...directProps} />
            ) : (
              <Placeholder />
            )}
          </SdkErrorBoundary>
          <JsonBlock title="Props" value={directProps} />
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Transformed URL</Text>
          <SdkErrorBoundary fallbackTitle="Transformed URL render failed">
            {hasImageUrlConfig ? (
              <ImgwireImage {...transformedProps} />
            ) : (
              <Placeholder />
            )}
          </SdkErrorBoundary>
          <JsonBlock title="Transform props" value={transformedProps} />
        </View>
      </View>
    </Section>
  );
}

function Placeholder() {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderText}>
        Add a valid `imageUrl` to exercise this section.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 12,
  },
  card: {
    gap: 10,
  },
  cardTitle: {
    color: '#102542',
    fontSize: 15,
    fontWeight: '700',
  },
  image: {
    backgroundColor: '#d9e2f2',
    borderRadius: 12,
    height: 180,
    width: '100%',
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
