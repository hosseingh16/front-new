import { defineFontProvider } from 'unifont';

const resolvableFonts = new Set<string>();
export default defineFontProvider('custom', () => {
  // Do some stuff
  resolvableFonts.add('dana-medium');
  return {
    async resolveFont(fontFamily) {
      if (!resolvableFonts.has(fontFamily)) {
        return;
      }
      return {
        fonts: [
          {
            src: [{ url: '/fonts/DanaFaNum-Medium.woff2', format: 'woff2' }],
            weight: 500,
          },
        ],
      };
    },
  };
});
