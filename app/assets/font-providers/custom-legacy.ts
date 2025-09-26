import type { FontProvider } from '@nuxt/fonts';

const resolvableFonts = new Set<string>();
export default {
  async setup() {
    // Do some stuff
    resolvableFonts.add('dana-medium-legacy');
  },
  // @ts-expect-error testing legacy API
  async resolveFontFaces(fontFamily) {
    if (!resolvableFonts.has(fontFamily)) {
      return;
    }
    return {
      fonts: {
        src: '/fonts/DanaFaNum-Medium.woff2',
        weight: 500,
      },
    };
  },
} satisfies FontProvider;
