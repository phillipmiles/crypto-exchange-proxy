module.exports = {
  root: true,
  // allows us to parse the code with babel so that jsx code won't be considered an error
  parser: '@typescript-eslint/parser',
  plugins: ['prettier', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/no-explicit-any': ['off'],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
        endOfLine: 'auto',
      },
    ],
  },
  overrides: [
    // Overrides to stop typescript displaying various linting warnings for js files.
    {
      files: ['*.js', '*.jsx'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
