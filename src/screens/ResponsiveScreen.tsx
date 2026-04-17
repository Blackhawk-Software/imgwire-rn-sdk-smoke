import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import {
  useResponsiveImage,
  type ResponsiveBreakpoint,
} from '@imgwire/react-native';
import {
  ControlButton,
  JsonBlock,
  Row,
  Section,
  StatusText,
} from '../components/Section';
import { IMGWIRE_CONFIG, hasImageUrlConfig } from '../config';

const breakpoints: ResponsiveBreakpoint[] = [
  {
    minWidth: 0,
    width: 320,
    height: 180,
    crop: '320:180:ce:0:0',
    quality: 60,
    format: 'webp',
    dpr: [1, 2],
  },
  {
    minWidth: 390,
    width: 390,
    height: 220,
    crop: '390:220:ce:0:0',
    quality: 70,
    format: 'webp',
    dpr: [1, 2, 3],
  },
  {
    minWidth: 768,
    width: 768,
    height: 432,
    crop: '768:432:ce:0:0',
    quality: 80,
    format: 'jpg',
    dpr: [1, 2],
  },
];

export function ResponsiveScreen() {
  const [layoutWidth, setLayoutWidth] = useState(390);
  const responsiveUrl = useResponsiveImage({
    url: hasImageUrlConfig ? IMGWIRE_CONFIG.imageUrl : undefined,
    width: layoutWidth,
    breakpoints,
  });

  useEffect(() => {
    if (responsiveUrl) {
      console.log('useResponsiveImage URL changed', {
        width: layoutWidth,
        responsiveUrl,
      });
    }
  }, [layoutWidth, responsiveUrl]);

  return (
    <Section
      title="useResponsiveImage"
      subtitle="Switches simulated layout widths and shows the derived URL plus the rendered result."
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
      <Row>
        <ControlButton
          label="320"
          onPress={() => setLayoutWidth(320)}
          disabled={layoutWidth === 320}
        />
        <ControlButton
          label="390"
          onPress={() => setLayoutWidth(390)}
          disabled={layoutWidth === 390}
        />
        <ControlButton
          label="768"
          onPress={() => setLayoutWidth(768)}
          disabled={layoutWidth === 768}
        />
      </Row>
      <StatusText label="layoutWidth" value={`${layoutWidth}px`} />
      <StatusText
        label="crop semantics"
        value="absolute crop values with explicit gravity/offsets"
      />
      <View style={[styles.preview, { width: Math.min(layoutWidth, 340) }]}>
        {responsiveUrl ? (
          <Image
            source={{ uri: responsiveUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              Responsive URL will appear once `imageUrl` is configured.
            </Text>
          </View>
        )}
      </View>
      <JsonBlock
        title="Responsive output"
        value={{
          layoutWidth,
          breakpoints,
          responsiveUrl,
        }}
      />
    </Section>
  );
}

const styles = StyleSheet.create({
  preview: {
    alignSelf: 'center',
  },
  image: {
    backgroundColor: '#d9e2f2',
    borderRadius: 12,
    height: 220,
    width: '100%',
  },
  placeholder: {
    alignItems: 'center',
    backgroundColor: '#eef2f8',
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 220,
    padding: 16,
  },
  placeholderText: {
    color: '#51607a',
    textAlign: 'center',
  },
});
