module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard-with-typescript',
    'plugin:vue/vue3-essential',
    "plugin:prettier/recommended",
  ],
  overrides: [
    {
      env: {node: true},
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {sourceType: 'script'}
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
    project: ['tsconfig.json'],
    tsconfigRootDir: __dirname,
    extraFileExtensions: ['.vue']
  },
  plugins: [
    'vue'
  ],
  rules: {
    "no-console": "off"
  }
}
