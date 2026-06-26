import antfu from '@antfu/eslint-config';

export default antfu(
  {
    react: true,
    typescript: true,
    stylistic: {
      semi: true,
    },

    formatters: {
      css: true,
    },
    ignores: [
      '**/*.md',
      'public/@powersync/**',
      'src/routeTree.gen.ts',
    ],
  },
  {
    rules: {
      'no-console': 'off',
      'node/prefer-global/process': 'off',
      'ts/no-namespace': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
);
