module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['@react-native-community'],
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  rules: {
    'prettier/prettier': 0,
    semi: 'off',
    indent: 'off',
    '@typescript-eslint/no-unused-vars': 0,
    strict: 1,
    //'no-unused-vars': ['warn', { ignoreRestSiblings: true }],
    curly: 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'], // Your TypeScript files extension
      parserOptions: {
        project: ['./tsconfig.json'], // Specify it only for TypeScript files
      },
    },
  ],
}
