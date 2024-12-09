await Bun.build({
  entrypoints: ['src/index.tsx'],
  minify: true,
  outdir: 'dist',
  target: 'bun',
  sourcemap: 'linked',
}).catch(() => process.exit(1));
export {};
