'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-403083de.js');
const appGlobals = require('./app-globals-3a1e7e63.js');

const defineCustomElements = async (win, options) => {
  if (typeof window === 'undefined') return undefined;
  await appGlobals.globalScripts();
  return index.bootstrapLazy([["lod-table.cjs",[[0,"lod-table",{"endpoint":[1],"query":[1],"countQuery":[1,"count-query"],"itemsPerPage":[1,"items-per-page"],"ctaText":[1,"cta-text"],"ctaUrl":[1,"cta-url"],"tableCaption":[1,"table-caption"],"queryModified":[32],"count":[32],"page":[32],"headers":[32],"items":[32],"paginationString":[32],"_itemsPerPage":[32],"pagesResult":[32],"currentPageItems":[32],"isFetching":[32],"visualPage":[32]}]]],["lod-card_2.cjs",[[0,"lod-cards",{"endpoint":[1],"query":[1],"countQuery":[1,"count-query"],"itemsPerPage":[1,"items-per-page"],"ctaText":[1,"cta-text"],"ctaUrl":[1,"cta-url"],"queryModified":[32],"count":[32],"page":[32],"items":[32],"paginationString":[32],"_itemsPerPage":[32],"pagesResult":[32],"currentPageItems":[32],"isFetching":[32],"visualPage":[32]}],[0,"lod-card",{"cardTitle":[1,"card-title"],"description":[1],"address":[1],"addressUrl":[1,"address-url"],"date":[1],"tag":[1],"imageUrl":[1,"image-url"],"readMoreText":[1,"read-more-text"],"readMoreUrl":[1,"read-more-url"]}]]]], options);
};

exports.setNonce = index.setNonce;
exports.defineCustomElements = defineCustomElements;

//# sourceMappingURL=loader.cjs.js.map