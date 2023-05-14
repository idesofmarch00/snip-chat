module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{js,css,woff,woff2,png,svg,ico,html,json}',
    'index.html',
  ],
  swSrc: 'src-pwa/custom-service-worker.ts',
  swDest: 'dist/pwa/sw.js',
};
