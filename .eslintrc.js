module.exports = {
        files: ['server/**/*.js', 'utils/**/*.js'],
      rules: {
        'no-unused-vars': 'warn',
      },
    },{
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': 'warn',
  },
  overrides: [
    {
      files: ['server/**/*.js', 'utils/**/*.js'],
      rules: {
        'no-unused-vars': 'warn',
      }
    }
  ],
  ignorePatterns: ['client/**/*'],
};
