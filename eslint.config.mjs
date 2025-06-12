import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions';
import functional from 'eslint-plugin-functional';
import parser from '@typescript-eslint/parser';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  eslintPluginUnicorn.configs.recommended,
  // functional.configs.off,
  // eslint.configs.recommended,
  // tseslint.configs.recommended,
  // functional.configs.externalTypeScriptRecommended,
  // functional.configs.strict,
  // functional.configs.stylistic,
  {
    languageOptions: {
      parser,
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      'no-relative-import-paths': noRelativeImportPaths,
      'prefer-arrow-functions': preferArrowFunctions,
    },
    rules: {
      // 'functional/functional-parameters': ["off", { "enforceParameterCount": { "ignoreLambdaExpression": true } }],
      // "functional/prefer-immutable-types": ["error"],
      // "functional/no-expression-statements": ["off", { "ignoreVoid": true }],
      // "functional/no-return-void": ["error", { "ignoreInferredTypes": true }],
      // "functional/no-throw-statements": ["off"],
      'prefer-arrow-functions/prefer-arrow-functions': [
        'error',
        { returnStyle: 'unchanged' },
      ],
      'no-relative-import-paths/no-relative-import-paths': [
        'error',
        { prefix: '@' },
      ],
      'unicorn/prevent-abbreviations': ['off'],
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            kebabCase: true,
          },
        },
      ],
    },
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];

export default eslintConfig;
