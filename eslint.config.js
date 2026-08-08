import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

const restrictLayerImports = (layers, message) => [
  'error',
  {
    patterns: [
      {
        group: ['../**'],
        message: 'Use the @/ alias for imports that cross directory boundaries.',
      },
      {
        group: layers.flatMap((layer) => [`@/${layer}`, `@/${layer}/**`]),
        message,
      },
    ],
  },
];

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['src/domain/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictLayerImports(
        ['app', 'application', 'infrastructure', 'presentation'],
        'The domain layer must not depend on outer layers.',
      ),
    },
  },
  {
    files: ['src/application/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictLayerImports(
        ['app', 'infrastructure', 'presentation'],
        'The application layer may depend only on domain and shared code.',
      ),
    },
  },
  {
    files: ['src/infrastructure/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictLayerImports(
        ['app', 'presentation'],
        'Infrastructure adapters must not depend on the UI or composition root.',
      ),
    },
  },
  {
    files: ['src/presentation/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictLayerImports(
        ['app', 'infrastructure'],
        'The presentation layer must access external systems through application ports.',
      ),
    },
  },
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': restrictLayerImports(
        ['app', 'application', 'domain', 'infrastructure', 'presentation'],
        'Shared code must remain independent from application layers.',
      ),
    },
  },
  prettier,
]);
