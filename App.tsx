import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ImgwireProvider } from '@imgwire/react-native';
import { Section } from './src/components/Section';
import {
  IMGWIRE_CLIENT_CONFIG,
  IMGWIRE_CONFIG,
  hasImageIdConfig,
  hasImageUrlConfig,
  hasPublishableApiKey,
} from './src/config';
import { FetchImageScreen } from './src/screens/FetchImageScreen';
import { ImageByIdScreen } from './src/screens/ImageByIdScreen';
import { ImageByUrlScreen } from './src/screens/ImageByUrlScreen';
import { ProviderMisuseScreen } from './src/screens/ProviderMisuseScreen';
import { ResponsiveScreen } from './src/screens/ResponsiveScreen';
import { UploadScreen } from './src/screens/UploadScreen';

function ConfigurationStatus() {
  const ready = hasPublishableApiKey && hasImageIdConfig && hasImageUrlConfig;

  return (
    <Section
      title="Configuration"
      subtitle="Set `EXPO_PUBLIC_IMGWIRE_*` values or edit `src/config.ts`."
    >
      <Text
        style={[
          styles.banner,
          ready ? styles.bannerSuccess : styles.bannerWarning,
        ]}
      >
        {ready
          ? 'Publishable key and smoke-test image data are configured.'
          : 'Configuration is incomplete. Success-path scenarios stay visible, but you need a real publishable key, image ID, and CDN URL to validate the SDK end-to-end.'}
      </Text>
      <View style={styles.configList}>
        <Text style={styles.configItem}>
          apiKey:{' '}
          {hasPublishableApiKey ? 'configured' : 'missing or placeholder'}
        </Text>
        <Text style={styles.configItem}>
          imageId:{' '}
          {hasImageIdConfig ? IMGWIRE_CONFIG.imageId : 'missing or placeholder'}
        </Text>
        <Text style={styles.configItem}>
          imageUrl:{' '}
          {hasImageUrlConfig
            ? IMGWIRE_CONFIG.imageUrl
            : 'missing or placeholder'}
        </Text>
        <Text style={styles.configItem}>
          invalidImageId: {IMGWIRE_CONFIG.invalidImageId}
        </Text>
        <Text style={styles.configItem}>
          baseUrl: {IMGWIRE_CONFIG.baseUrl ?? 'default'}
        </Text>
      </View>
    </Section>
  );
}

function TestHarness() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Imgwire React Native Expo Smoke Test</Text>
      <Text style={styles.subheading}>
        This harness exercises the published `@imgwire/react-native@0.1.1`
        package against Expo runtime primitives.
      </Text>
      <ConfigurationStatus />
      <ImageByUrlScreen />
      <ImageByIdScreen />
      <FetchImageScreen />
      <ResponsiveScreen />
      <UploadScreen />
      <Text style={styles.footer}>
        Provider misuse is tested separately below so the main harness stays
        inside `ImgwireProvider`.
      </Text>
    </ScrollView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <ImgwireProvider config={IMGWIRE_CLIENT_CONFIG}>
          <TestHarness />
        </ImgwireProvider>
        <ScrollView contentContainerStyle={styles.misuseContainer}>
          <ProviderMisuseScreen />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  content: {
    gap: 16,
    padding: 16,
    paddingBottom: 32,
  },
  misuseContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  heading: {
    color: '#102542',
    fontSize: 28,
    fontWeight: '700',
  },
  subheading: {
    color: '#51607a',
    fontSize: 15,
    lineHeight: 22,
  },
  banner: {
    borderRadius: 10,
    overflow: 'hidden',
    padding: 12,
  },
  bannerSuccess: {
    backgroundColor: '#d8f3dc',
    color: '#1b4332',
  },
  bannerWarning: {
    backgroundColor: '#fff3bf',
    color: '#7c5b00',
  },
  configList: {
    gap: 6,
  },
  configItem: {
    color: '#22324f',
    fontSize: 13,
  },
  footer: {
    color: '#66758f',
    fontSize: 12,
    textAlign: 'center',
  },
});
