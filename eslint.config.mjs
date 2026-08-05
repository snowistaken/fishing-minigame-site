import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

// Flat-config replacement for the removed `next lint` (Next 16). Mirrors the old
// .eslintrc.json: Next's core-web-vitals rules, with no-img-element disabled
// since the site deliberately uses raw <img> for pixel-art assets.
const eslintConfig = [
  { ignores: ['.next/**', 'out/**', 'next-env.d.ts'] },
  ...nextCoreWebVitals,
  {
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
]

export default eslintConfig
