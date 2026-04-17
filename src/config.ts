const DEFAULTS = {
  apiKey: 'pk_replace_me',
  baseUrl: '',
  imageId: 'img_replace_me',
  imageUrl: 'https://cdn.imgwire.dev/replace-me',
};

function cleanValue(value: string | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

function isConfigured(value: string, placeholderPrefix: string) {
  return value.length > 0 && !value.startsWith(placeholderPrefix);
}

export const IMGWIRE_CONFIG = {
  apiKey: cleanValue(process.env.EXPO_PUBLIC_IMGWIRE_API_KEY, DEFAULTS.apiKey),
  baseUrl: cleanValue(
    process.env.EXPO_PUBLIC_IMGWIRE_BASE_URL,
    DEFAULTS.baseUrl,
  ),
  imageId: cleanValue(
    process.env.EXPO_PUBLIC_IMGWIRE_IMAGE_ID,
    DEFAULTS.imageId,
  ),
  imageUrl: cleanValue(
    process.env.EXPO_PUBLIC_IMGWIRE_IMAGE_URL,
    DEFAULTS.imageUrl,
  ),
  invalidImageId: cleanValue(
    process.env.EXPO_PUBLIC_IMGWIRE_INVALID_IMAGE_ID,
    'img_invalid_smoke_test',
  ),
};

export const IMGWIRE_CLIENT_CONFIG = {
  apiKey: IMGWIRE_CONFIG.apiKey,
  baseUrl: IMGWIRE_CONFIG.baseUrl || undefined,
};

export const hasPublishableApiKey = isConfigured(
  IMGWIRE_CONFIG.apiKey,
  'pk_replace_',
);
export const hasImageIdConfig = isConfigured(
  IMGWIRE_CONFIG.imageId,
  'img_replace_',
);
export const hasImageUrlConfig = isConfigured(
  IMGWIRE_CONFIG.imageUrl,
  'https://cdn.imgwire.dev/replace-',
);
