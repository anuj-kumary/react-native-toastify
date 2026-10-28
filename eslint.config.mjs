import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['lib/', 'node_modules/', 'coverage/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ['*.js', '*.mjs'], languageOptions: { globals: globals.node } },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    languageOptions: { globals: { __DEV__: 'readonly' } },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // The optional react-native-safe-area-context lookup has to be a runtime require.
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
);
