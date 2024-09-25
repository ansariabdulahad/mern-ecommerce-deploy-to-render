import js from '@eslint/js';
import node from 'eslint-plugin-node';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default [
    { ignores: ['dist'] }, // Ignore the build output folder
    {
        files: ['**/*.{js,mjs}'], // Apply to all JavaScript and ES module files
        languageOptions: {
            ecmaVersion: 2020, // Allows modern ECMAScript syntax
            sourceType: 'module', // Enables ES module syntax (import/export)
            globals: {
                ...globals.node, // Includes Node.js global variables
            },
        },
        plugins: {
            node,
            // import: importPlugin, // Ensures correct import/export syntax
        },
        rules: {
            ...js.configs.recommended.rules, // Recommended rules from ESLint
            ...node.configs.recommended.rules, // Node.js specific rules
            'import/no-unresolved': 'error', // Ensures all imports can be resolved
            'import/extensions': [
                'error',
                'ignorePackages',
                {
                    js: 'always', // Enforce using .js extension for ES modules
                    mjs: 'always',
                },
            ],
            // 'no-console': 'warn', // Warns about console.log usage in the server
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Ignore unused variables prefixed with _
        },
    },
];
