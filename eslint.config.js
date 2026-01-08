import { defineConfig } from 'eslint/config';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default defineConfig([
    {
        ignores: ['**/node_modules/**', '**/dist/**', '**/tests/**', '**/coverage/**'],
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            ...tsPlugin.configs['recommended'].rules,
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
]);
