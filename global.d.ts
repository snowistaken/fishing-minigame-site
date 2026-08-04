// Next ships types for `*.module.css` but not for plain stylesheet imports,
// which TypeScript 6 requires a declaration for (TS2882). This covers the
// side-effect import of globals.css in app/layout.tsx.
declare module '*.css'
