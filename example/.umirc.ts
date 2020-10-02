import { defineConfig } from 'umi';

export default defineConfig({
  pwa: {
    src: 'manifest.json',
    hash: true,
  },
  plugins: [require.resolve('../lib')],
});
