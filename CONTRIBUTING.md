# Contributing

Thanks for helping improve react-native-toastify-expo! Bug reports, docs fixes and features are all welcome.

## Getting started

```bash
git clone https://github.com/<your-username>/react-native-toastify.git
cd react-native-toastify
npm ci
npm run build   # type-checks and compiles src/ to lib/
```

The library source is in `src/` (`components/Toast`, `context/ToastContext`, exported from `src/index.ts`). `lib/` is build output and is not committed.

## Making a change

1. For anything bigger than a small fix, open an issue first so we can agree on the approach.
2. Create a branch from `main`.
3. Keep the change focused, and update the README if the public API changes.
4. Make sure `npm run build` passes, then open a pull request and fill in the template.

CI must pass before a pull request can be merged into `main`.

## Releases

Maintainers publish to npm by creating a GitHub release (`vX.Y.Z`) after bumping `version` in `package.json`.

## Code of conduct

By taking part you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
