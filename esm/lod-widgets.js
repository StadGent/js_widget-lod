import { p as promiseResolve, b as bootstrapLazy } from './index-f6268475.js';
export { s as setNonce } from './index-f6268475.js';
import { g as globalScripts } from './app-globals-0f993ce5.js';

/*
 Stencil Client Patch Browser v4.21.0 | MIT Licensed | https://stenciljs.com
 */
var patchBrowser = () => {
  const importMeta = import.meta.url;
  const opts = {};
  if (importMeta !== "") {
    opts.resourcesUrl = new URL(".", importMeta).href;
  }
  return promiseResolve(opts);
};

patchBrowser().then(async (options) => {
  await globalScripts();
  return bootstrapLazy([["lod-table",[[0,"lod-table",{"endpoint":[1],"query":[1],"countQuery":[1,"count-query"],"itemsPerPage":[1,"items-per-page"],"ctaText":[1,"cta-text"],"ctaUrl":[1,"cta-url"],"tableCaption":[1,"table-caption"],"queryModified":[32],"count":[32],"page":[32],"headers":[32],"items":[32],"paginationString":[32],"_itemsPerPage":[32],"pagesResult":[32],"currentPageItems":[32],"isFetching":[32],"visualPage":[32]}]]],["lod-card_2",[[0,"lod-cards",{"endpoint":[1],"query":[1],"countQuery":[1,"count-query"],"itemsPerPage":[1,"items-per-page"],"ctaText":[1,"cta-text"],"ctaUrl":[1,"cta-url"],"queryModified":[32],"count":[32],"page":[32],"items":[32],"paginationString":[32],"_itemsPerPage":[32],"pagesResult":[32],"currentPageItems":[32],"isFetching":[32],"visualPage":[32]}],[0,"lod-card",{"cardTitle":[1,"card-title"],"description":[1],"address":[1],"addressUrl":[1,"address-url"],"date":[1],"tag":[1],"imageUrl":[1,"image-url"],"readMoreText":[1,"read-more-text"],"readMoreUrl":[1,"read-more-url"]}]]]], options);
});

//# sourceMappingURL=lod-widgets.js.map