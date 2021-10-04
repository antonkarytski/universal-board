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
    '@typescript-eslint/no-unused-vars': ['warn', { ignoreRestSiblings: true }],
    'no-unused-vars': ['warn', { ignoreRestSiblings: true }],

    curly: 'off',
  },
}
