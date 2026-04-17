# Tested Scenarios Checklist

Use this checklist to record smoke-test coverage for `imgwire-rn-sdk-smoke`.

## Provider and setup

- [ ] App boots in Expo without runtime errors
- [ ] `ImgwireProvider` wraps the test harness
- [ ] Config is loaded from local constants or env
- [ ] Config uses a publishable API key only

## Image rendering

- [ ] Image renders successfully from a direct URL
- [ ] Image renders successfully from an Imgwire image ID
- [ ] Transformed URL output is visible and understandable
- [ ] Loading state is visible while images resolve
- [ ] Error state is visible for invalid image inputs

## `useFetchImage`

- [ ] Valid image ID resolves successfully
- [ ] Returned `data.id` is shown in the UI
- [ ] Returned `data.cdn_url` is shown in the UI
- [ ] Invalid image ID shows a clear error state
- [ ] Retry/remount path works

## `useResponsiveImage`

- [ ] Breakpoint output changes when width changes
- [ ] Returned responsive URL is visible in selectable text
- [ ] Rendered image matches the returned responsive URL
- [ ] Width presets can be switched in the UI

## Upload

- [ ] Device photo picker opens successfully
- [ ] Local file URI is converted into upload input shape
- [ ] Upload succeeds with a selected local asset
- [ ] Upload progress updates are visible
- [ ] Upload success result shows the uploaded image ID
- [ ] Upload success result shows a CDN URL when available
- [ ] Upload error state is visible for invalid upload input

## Upload cancellation

- [ ] In-flight upload can be cancelled with AbortController
- [ ] Cancelled state is distinguishable from generic error

## Observability

- [ ] Upload start is logged to console
- [ ] Upload success is logged to console
- [ ] Upload error is logged to console
- [ ] Fetch success is logged to console
- [ ] Fetch error is logged to console
- [ ] Responsive URL changes are logged to console

## Final pass

- [ ] All results are observable in the UI without reading source
- [ ] No unexpected crashes during normal test flow
