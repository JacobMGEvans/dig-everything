await Bun.build({
  entrypoints: ['src/index.tsx'],
  minify: true,
  outdir: 'dist',
  target: 'bun',
  sourcemap: 'none',
}).catch(() => process.exit(1));
export {};
