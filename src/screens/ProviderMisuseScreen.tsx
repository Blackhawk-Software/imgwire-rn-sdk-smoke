import React, { useEffect } from 'react';
import { useFetchImage } from '@imgwire/react-native';
import { JsonBlock, Section, StatusText } from '../components/Section';
import { IMGWIRE_CONFIG } from '../config';

export function ProviderMisuseScreen() {
  const state = useFetchImage(IMGWIRE_CONFIG.invalidImageId);

  useEffect(() => {
    if (state.error) {
      console.log('Provider misuse example', state.error.message);
    }
  }, [state.error]);

  return (
    <Section
      title="Missing Provider Example"
      subtitle="This isolated section intentionally renders outside `ImgwireProvider` to show the SDK's hook-level error state without crashing the main harness."
    >
      <StatusText label="isLoading" value={String(state.isLoading)} />
      <StatusText
        label="error"
        value={state.error?.message ?? 'none'}
        tone={state.error ? 'error' : 'default'}
      />
      <JsonBlock
        title="Hook output outside provider"
        value={{
          isLoading: state.isLoading,
          error: state.error?.message ?? null,
          data: state.data,
        }}
      />
    </Section>
  );
}
