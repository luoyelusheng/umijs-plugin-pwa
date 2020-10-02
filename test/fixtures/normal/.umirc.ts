
export default {
  pwa: {
    src:'manifest.json',
    hash: true,
  },
  plugins: [require.resolve('../../../lib')]
}
