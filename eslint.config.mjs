import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      '.next_build/**',
      'out/**',
      'build/**',
      'coverage/**',
      'three-geojson/**',
      'next-env.d.ts',
    ],
  },
];

export default eslintConfig;
