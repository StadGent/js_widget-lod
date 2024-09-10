import { p as proxyCustomElement, H, h } from './p-a8bc01a6.js';
import { g as getQueryWithoutLimit, a as getFormattedObjectValue } from './p-a98ce3c7.js';
import { d as defineCustomElement$2 } from './p-2c767efa.js';

const lodCardsCss = ".sr-only{position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden}.lod-cards{display:flex;flex-direction:column}.lod-cards .pager__items{justify-content:center !important}.lod-cards .results-text{margin-bottom:20px}.lod-cards .cta-btn{align-self:flex-start;font-size:16px;line-height:24px;margin-left:30px;margin-bottom:60px}.lod-cards .cta-btn:before{content:url(\"./assets/share-icon.svg\");width:24px;height:24px;margin-left:0;border-bottom:0;position:absolute;vertical-align:-50%;left:-30px;padding-top:1px}.lod-cards .filter__results{margin-left:0}.lod-cards #previous,.lod-cards #next{cursor:pointer;display:block}";
const LodCardsStyle0 = lodCardsCss;

const LodCards$1 = /*@__PURE__*/ proxyCustomElement(class LodCards extends H {
    constructor() {
        super();
        this.__registerHost();
        this.endpoint = undefined;
        this.query = undefined;
        this.countQuery = undefined;
        this.itemsPerPage = undefined;
        this.ctaText = undefined;
        this.ctaUrl = undefined;
        this.queryModified = undefined;
        this.count = 0;
        this.page = 1;
        this.items = undefined;
        this.paginationString = undefined;
        this._itemsPerPage = 10;
        this.pagesResult = [];
        this.currentPageItems = undefined;
        this.isFetching = false;
        this.visualPage = 1;
    }
    componentWillLoad() {
        this.queryModified = this.query;
        if (this.itemsPerPage &&
            this.itemsPerPage !== "" &&
            Number(this.itemsPerPage)) {
            this._itemsPerPage = Number(this.itemsPerPage);
        }
        this.paginationString = `LIMIT ${this._itemsPerPage} OFFSET ${this._itemsPerPage * this.page - this._itemsPerPage}`;
        this.queryModified += ` ${this.paginationString}`;
        this.executeQuery();
        this.executeCountQuery();
    }
    get queryUrl() {
        const url = new URL(this.endpoint);
        url.searchParams.set("query", this.queryModified);
        return url;
    }
    async executeCountQuery() {
        const url = new URL(this.endpoint);
        url.searchParams.set("query", this.countQuery);
        this.isFetching = true;
        const response = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/sparql-results+json",
            },
        });
        if (response.ok) {
            const result = await response.json();
            this.count = Number(result.results.bindings[0].count.value);
            this.isFetching = false;
        }
        else {
            console.log("Error when getting count data.");
            console.log(this.queryModified);
        }
    }
    async executeQuery() {
        // Check if we have the result cached locally
        if (!this.pagesResult.find((res) => res.page === this.page)) {
            const response = await fetch(this.queryUrl.toString(), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Accept: "application/sparql-results+json",
                },
            });
            if (response.ok) {
                const result = await response.json();
                const data = result.results.bindings;
                this.pagesResult.push({
                    page: this.page,
                    result: data,
                });
                this.currentPageItems = data;
            }
            else {
                console.log("Error when getting data.");
                console.log(this.queryModified);
            }
        }
        else {
            this.currentPageItems = this.pagesResult.find((res) => res.page === this.page).result;
        }
    }
    get queryWithoutLimit() {
        return getQueryWithoutLimit(this.queryModified, this.paginationString);
    }
    async decrementPage() {
        if (this.page > 1) {
            this.queryModified = this.queryWithoutLimit;
            this.page -= 1;
            this.paginationString = `LIMIT ${this._itemsPerPage} OFFSET ${this._itemsPerPage * this.page - this._itemsPerPage}`;
            this.queryModified += this.paginationString;
            await this.executeQuery();
            this.visualPage -= 1;
        }
    }
    async incrementPage() {
        if (this.page < this.count) {
            this.queryModified = this.queryWithoutLimit;
            this.page += 1;
            this.paginationString = `LIMIT ${this._itemsPerPage} OFFSET ${this._itemsPerPage * this.page - this._itemsPerPage}`;
            this.queryModified += this.paginationString;
            await this.executeQuery();
            this.visualPage += 1;
        }
    }
    render() {
        var _a, _b;
        if (this.count !== 0 && this.currentPageItems) {
            return (h("div", { key: 'a9feaed116e4043e1365145917a9e0df3ddfa931', class: "lod-cards" }, h("span", { key: 'ac68c10f9eaa243d256dc57a573ab75b632c99d4', class: "results-text" }, h("b", { key: '008492ab10cdd060fa9b59966ee805d4b213f098' }, "Er zijn ", this.count, " resultaten")), h("ul", { key: 'd50c5d025cb313be0616f25f4173deea0d75a611', class: "filter__results" }, (_a = this.currentPageItems) === null || _a === void 0 ? void 0 : _a.map((item) => {
                var _a, _b, _c, _d, _e;
                return (h("lod-card", { tag: (_a = item["cat"]) === null || _a === void 0 ? void 0 : _a.value, address: (_b = item["loc"]) === null || _b === void 0 ? void 0 : _b.value, "card-title": "test", "image-url": (_c = item["img"]) === null || _c === void 0 ? void 0 : _c.value, description: (_d = item["txt"]) === null || _d === void 0 ? void 0 : _d.value, "read-more-url": (_e = item["url"]) === null || _e === void 0 ? void 0 : _e.value, date: getFormattedObjectValue(item["dat"]) }));
            })), h("a", { key: '0a25589f441ddf37c2d2e9186ea6e221a5fbe746', class: "cta-btn", href: this.ctaUrl && this.ctaUrl !== ""
                    ? this.ctaUrl
                    : `${this.queryUrl.toString()}` }, (_b = this.ctaText) !== null && _b !== void 0 ? _b : "Bekijk de data via ons SPARQL-endpoint"), this.count !== 0 && this.currentPageItems && (h("nav", { key: 'c779ea303b4adeb05ff70912859cb097e62983eb', class: "pager", "aria-labelledby": "pagination_1-55553" }, h("h2", { key: 'e90ba9cc8a241c99962bd2158c0def4c80916ed7', id: "pagination_1-55553", class: "visually-hidden" }, "Pagination"), h("ul", { key: 'd7e45dccdb52e75c4ca0c0911f90a4db71438298', class: "pager__items" }, h("li", { key: 'b94e8f47b3841ec147d4bcabf1978eccd8c5fef1', onClick: () => this.visualPage === this.page ? this.decrementPage() : null, style: { display: this.visualPage === 1 ? "none" : "block" }, id: "previous", class: "previous" }, h("a", { key: '98e12380d3abc76615a2100617aad5bee63e916b', class: "standalone-link back" }, "Vorige", h("span", { key: '791b0ca708265d3f6a54d8462e20c4b3be0d55dc', class: "visually-hidden" }, "pagina"))), h("li", { key: '2581a516089f9a1f82b52d4d304ac5246f7f63e9', class: "current-page" }, "Pagina ", this.visualPage, " van ", this.count), h("li", { key: 'fea9c3f96769d8ef1add1a1ebb7671e017fdc444', onClick: () => this.visualPage === this.page ? this.incrementPage() : null, style: {
                    display: this.visualPage == this.count ? "none" : "block",
                }, id: "next", class: "next" }, h("a", { key: 'd04c639ba1dc2c9870358b3173e84f1394ae8dd9', class: "standalone-link" }, "Volgende", h("span", { key: '31b4647866986301f84758ee779d4930f6c9daed', class: "visually-hidden" }, "pagina"))))))));
        }
    }
    static get style() { return LodCardsStyle0; }
}, [0, "lod-cards", {
        "endpoint": [1],
        "query": [1],
        "countQuery": [1, "count-query"],
        "itemsPerPage": [1, "items-per-page"],
        "ctaText": [1, "cta-text"],
        "ctaUrl": [1, "cta-url"],
        "queryModified": [32],
        "count": [32],
        "page": [32],
        "items": [32],
        "paginationString": [32],
        "_itemsPerPage": [32],
        "pagesResult": [32],
        "currentPageItems": [32],
        "isFetching": [32],
        "visualPage": [32]
    }]);
function defineCustomElement$1() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["lod-cards", "lod-card"];
    components.forEach(tagName => { switch (tagName) {
        case "lod-cards":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, LodCards$1);
            }
            break;
        case "lod-card":
            if (!customElements.get(tagName)) {
                defineCustomElement$2();
            }
            break;
    } });
}
defineCustomElement$1();

const LodCards = LodCards$1;
const defineCustomElement = defineCustomElement$1;

export { LodCards, defineCustomElement };

//# sourceMappingURL=lod-cards.js.map