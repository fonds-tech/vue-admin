import eslint from '@fonds/eslint-config'

export default eslint(
  {
    type: 'app',
    vue: true,
    jsx: true,
    typescript: true,
    formatters: true,
  },
  {
    rules: {
      'ts/no-use-before-define': 'off',
      'no-async-promise-executor': 'off',
    },
  },

)
