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
      // The classic hooks rules only. v7's recommended set adds React Compiler rules that reject the
      // latest-value-in-a-ref pattern the toast timers rely on; this library isn't built with the compiler.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // The optional react-native-safe-area-context lookup has to be a runtime require.
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
);
