import { defineFontProvider } from 'unifont';

const resolvableFonts = new Map<string, { url: string; weight?: number }>();
export default defineFontProvider('custom', () => {
  resolvableFonts.set('yekanBakh-regular', {
    url: '/fonts/YekanBakhFaNum-Regular.woff2',
    weight: 500,
  });
  resolvableFonts.set('yekanBakh-bold', {
    url: '/fonts/YekanBakhFaNum-Bold.woff2',
    weight: 700,
  });
  resolvableFonts.set('yekanBakh-extraBold', {
    url: '/fonts/YekanBakhFaNum-ExtraBold.woff2',
    weight: 800,
  });
  return {
    async resolveFont(fontFamily) {
      const font = resolvableFonts.get(fontFamily);
      if (!font) return;
      return {
        fonts: [
          {
            src: [{ url: font.url, format: 'woff2' }],
            weight: font.weight ?? 400,
          },
        ],
      };
    },
  };
});
