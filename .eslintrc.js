module.exports = {
    env: {
        node: true,
        commonjs: true,
        es6: true,
    },
    extends: ['eslint:recommended'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2018,
    },
    rules: {
        "indent": ["error", 4, { "SwitchCase": 1 }],
        'no-unused-vars': 1,
        'no-use-before-define': 1,
        'no-redeclare': 1,
        'no-console': 0,
    },
};
