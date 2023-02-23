module.exports = {
    extends: ['eslint:recommended', 'airbnb-base'],
    parserOptions: {
      ecmaVersion: 13,
    },
    rules: {
      'import/no-extraneous-dependencies': ['error', { devDependencies: true, optionalDependencies: false, peerDependencies: false }],
      'no-console': 0,
      'no-new-wrappers': 0,
      'consistent-return': 0,
      'max-len': [
        'error',
        {
          code: 180,
          tabWidth: 2,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
    },
    env: {
      node: true,
      commonjs: true,
      es2021: true,
      mocha: true,
    },
    globals: {
      expect: true,
      assert: true,
    },
  };
  