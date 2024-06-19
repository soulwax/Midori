/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended',
    'plugin:@typescript-eslint/recommended', // TypeScript ESLint rules
    'prettier',  // Prettier rules 
    'eslint-config-prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['prettier'],
  root: true,
  env: {
    node: true,
    browser: true
  },
  parserOptions: {
    sourceType: 'module', // If using ES modules
    ecmaVersion: 2020
  },
  rules: {
    'prettier/prettier': 'error'
    // ...any other custom rules
  }
};