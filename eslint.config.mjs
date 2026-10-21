import js from '@eslint/js'
import next from 'eslint-plugin-next'
import prettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'

export default [
    ...js.configs.recommended,

    {
        files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
        parser: await tseslint.parser,
        parserOptions: {
            project: './tsconfig.json',
            tsconfigRootDir: process.cwd(),
            },
        },
        plugins: {
            '@typescript-eslint': await tseslint.plugin,
    },
        rules: {
            '@typescript-eslint/no-unused-vars': 'warn',
        },
    },

    next.configs.recommended,
    prettier,
]
