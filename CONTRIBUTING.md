# Contributing

Thanks for helping improve react-native-toastify-expo! Bug reports, docs fixes and features are all welcome.

## Getting started

```bash
git clone https://github.com/<your-username>/react-native-toastify.git
cd react-native-toastify
npm ci          # also installs the pre-commit hook
npm test        # Jest + React Native Testing Library
npm run build   # compiles src/ to lib/
```

To try your change in an app, edit `example/App.tsx` and run it with Expo, or paste it into the [Snack](https://snack.expo.dev/@git/github.com/anuj-kumary/react-native-toastify:example).

The library source is in `src/` (`components/Toast`, `context/ToastContext`, `toast.ts`, exported from `src/index.ts`). `lib/` is build output and is not committed.

## Code style

Formatting and linting are automatic, so reviews can focus on behavior:

- **Prettier** formats the code (`.prettierrc.json`: single quotes, trailing commas, 100 columns).
- **ESLint** catches bugs: TypeScript, React (`@eslint-react`), the rules of hooks, and Jest rules for tests. Prettier owns formatting, so ESLint has no style rules.
- **A pre-commit hook** (`simple-git-hooks` + `lint-staged`) runs `eslint --fix` and `prettier --write` on the files you commit. `npm ci` installs it.
- **CI** runs `npm run format:check`, `npm run lint`, `npm run build` and `npm test` on every pull request.

| Command | What it does |
|---------|--------------|
| `npm run format` | Formats every file with Prettier |
| `npm run format:check` | Fails if any file isn't formatted (CI runs this) |
| `npm run lint` / `npm run lint:fix` | Runs ESLint / fixes what it can |
| `npm run typecheck` | Type-checks without building |

**Editors:** the repo includes `.editorconfig` and VS Code settings. Install the recommended extensions (ESLint, Prettier, EditorConfig) when VS Code offers them, and files are formatted and lint-fixed on save.

A few conventions the linters don't cover:
- **Refs end in `Ref`** (`timerRef`). ESLint enforces this one.
- **Keep the latest callback props in a ref** instead of listing them as effect dependencies, so a parent re-render doesn't restart a toast's timer. See `callbacksRef` in `Toast.tsx`.
- **Each new option** gets a test in `src/__tests__/`, a row in the README tables, and ideally a button in `example/App.tsx`.

## Making a change

1. For anything bigger than a small fix, open an issue first so we can agree on the approach.
2. Create a branch from `main`.
3. Keep the change focused, and update the README if the public API changes.
4. Add or update tests in `src/__tests__/`. Make sure `npm run format:check`, `npm run lint`, `npm test` and `npm run build` pass, then open a pull request and fill in the template.

CI must pass before a pull request can be merged into `main`.

## Releases

Maintainers release from GitHub; nobody publishes from their own machine:

1. Bump `version` in `package.json` in a pull request, and merge it.
2. Create a GitHub release tagged `vX.Y.Z` on `main`. That starts `.github/workflows/publish.yml`.
3. The workflow builds the package and **stages** it on npm through trusted publishing (no tokens, with provenance). It also publishes it to GitHub Packages.
4. Open the package on npmjs.com → **Staged Packages** and click **Approve** (2FA required), or run `npm stage approve <stage-id>`. Only then does the version go live.

Staging means a compromised CI run can't put a release on npm without a maintainer's approval.

## Code of conduct

By taking part you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
