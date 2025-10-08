import { defineFontProvider } from 'unifont';

const resolvableFonts = new Set<string>();
export default defineFontProvider('custom', () => {
  // Do some stuff
  resolvableFonts.add('yekanBakh-regular');
  return {
    async resolveFont(fontFamily) {
      if (!resolvableFonts.has(fontFamily)) {
        return;
      }
      return {
        fonts: [
          {
            src: [{ url: '/fonts/YekanBakhFaNum-Regular.woff2', format: 'woff2' }],
            weight: 500,
          },
        ],
      };
    },
  };
});
