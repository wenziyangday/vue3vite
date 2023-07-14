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
    'vue',
    'eslint-plugin-simple-import-sort'
  ],
  rules: {
    "@typescript-eslint/return-await": "off",
    "@typescript-eslint/promise-function-async": "off",
    "no-console": "off",
    "no-return-await": 0,
    // 设置import排序规则
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "sort-imports": "off",
    "import/order": "off",
    "vue/multi-word-component-names": "off",
  }
}
