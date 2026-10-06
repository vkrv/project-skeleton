# expo-mobile profile

Copy `130-expo-mobile.mdc` → `.cursor/rules/130-expo-mobile.mdc`.

Update the rule `globs` if your app path differs from `apps/mobile`. Pair with `ui-design` for theme/primitives conventions.

Also covers TanStack Query first-load vs cached data, root error overlay + toast on `isError && !data`, and Metro isolation (`--port` when 8081 is taken).
