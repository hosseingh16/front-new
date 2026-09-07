export const useCachedAsyncData = createUseAsyncData({
  getCachedData(key, nuxtApp, ctx) {
    if (ctx.cause !== "initial") {
      return;
    }

    return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key];
  },
});
