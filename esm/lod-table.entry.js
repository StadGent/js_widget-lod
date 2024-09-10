import { r as registerInstance, h, F as Fragment } from './index-f6268475.js';
import { i as isNumber, g as getQueryWithoutLimit, a as getFormattedObjectValue } from './utils-fac76af7.js';

const lodTableCss = ".sr-only{position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden}.lod-table td{-ms-word-break:break-all;word-break:break-all;word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto}.lod-table dd{-ms-word-break:break-all;word-break:break-all;word-break:break-word;-webkit-hyphens:auto;-moz-hyphens:auto;hyphens:auto}.lod-table .pager__items{justify-content:center !important}.lod-table .results-text{margin-bottom:20px}.lod-table .cta-btn{align-self:flex-start;font-size:16px;line-height:24px;margin-left:30px;margin-bottom:60px}.lod-table .cta-btn:before{content:url(\"./assets/share-icon.svg\");width:24px;height:24px;margin-left:0;border-bottom:0;position:absolute;vertical-align:-50%;left:-30px;padding-top:1px}.lod-table .filter__results{margin-left:0}.lod-table #previous,.lod-table #next{cursor:pointer;display:block}";
const LodTableStyle0 = lodTableCss;

const LodTable = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.endpoint = undefined;
        this.query = undefined;
        this.countQuery = undefined;
        this.itemsPerPage = undefined;
        this.ctaText = undefined;
        this.ctaUrl = undefined;
        this.tableCaption = undefined;
        this.queryModified = undefined;
        this.count = 0;
        this.page = 1;
        this.headers = undefined;
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
        if (isNumber(this.itemsPerPage)) {
            this._itemsPerPage = Number(this.itemsPerPage);
        }
        this.paginationString = `LIMIT ${this._itemsPerPage} OFFSET ${this._itemsPerPage * this.page - this._itemsPerPage}`;
        this.queryModified += ` ${this.paginationString}`;
        this.executeQuery();
        this.executeCountQuery();
    }
    formatHeader(input) {
        // Replace all underscores with spaces
        let formattedString = input.replace(/_/g, " ");
        // Capitalize the first letter
        formattedString =
            formattedString.charAt(0).toUpperCase() + formattedString.slice(1);
        return formattedString;
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
                const filteredHeaders = result.head.vars.filter((header) => !header.startsWith("_"));
                this.headers = filteredHeaders;
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
        return (h("div", { key: 'db2c3ac61a1097e93c54a3d91f8597053cc5b1ee', class: "lod-table" }, h("div", { key: '46a534dead9c1dfb18eec1ceb77bb2ce03bd5474', class: "responsive-table" }, h("div", { key: '3a5be606e4614f3689a848e9e15f1fdd5439f00d', class: "table-wrapper" }, h("table", { key: 'e48c58cf28ad9fab0833b2c7b6cb9ed0660a9746' }, h("tr", { key: '30de35b5b7add010767d0d6079b652ec1523f4e5' }, this.headers &&
            this.headers.map((header) => (h("th", { scope: "col" }, this.formatHeader(header))))), (_a = this.currentPageItems) === null || _a === void 0 ? void 0 :
            _a.map((item) => (h("tr", null, this.headers &&
                this.headers.map((header) => (h("td", null, getFormattedObjectValue(item === null || item === void 0 ? void 0 : item[header]))))))), this.tableCaption && this.tableCaption !== "" && (h("caption", { key: '3fdac40c6d57f6afebb3ede7e610b4c920a68839', class: "sr-only" }, this.tableCaption))))), h("div", { key: 'b74381fbe11271021b692351920e603e8c0d2430', "aria-labelledby": "table-without-row-headers-list-description", class: "table-list" }, h("ul", { key: 'a54726e59ae4ea846758145b873e911bb6f33190' }, this.currentPageItems &&
            this.headers &&
            this.currentPageItems.map((item) => (h("li", null, h("dl", null, this.headers &&
                this.headers.map((header) => (h(Fragment, null, h("dt", null, this.formatHeader(header)), h("dd", null, item === null || item === void 0 ? void 0 : item[header].value))))))))), this.tableCaption && this.tableCaption !== "" && (h("div", { key: '205f16539c95830540f087b53936ab9d5466d64f', class: "sr-only", id: "table-list-description" }, this.tableCaption))), h("a", { key: '04dae4d177ca8d78ce4b8cd8ba68a094d28d7296', class: "cta-btn", href: this.ctaUrl && this.ctaUrl !== ""
                ? this.ctaUrl
                : `${this.queryUrl.toString()}` }, (_b = this.ctaText) !== null && _b !== void 0 ? _b : "Bekijk de data via ons SPARQL-endpoint"), this.count !== 0 && this.currentPageItems && (h("nav", { key: '157c0ecc6fd503f31fd86e746983087f68fea490', class: "pager", "aria-labelledby": "pagination_1-55553" }, h("h2", { key: '936e65617920b0eabd30606d38003b04b2a5463b', id: "pagination_1-55553", class: "visually-hidden" }, "Pagination"), h("ul", { key: '5fc00bcac8f07c83675cb72b29f69469feb05033', class: "pager__items" }, h("li", { key: '6a493b9b20ea58c65d0bb1d1312388a4105d09cf', onClick: () => this.visualPage === this.page ? this.decrementPage() : null, style: { display: this.visualPage === 1 ? "none" : "block" }, id: "previous", class: "previous" }, h("a", { key: 'd06fec7e8884199db25b27b7fb9a12c8c7083f5a', class: "standalone-link back" }, "Vorige", h("span", { key: '5845d309abd00478332b3bf1382e6e3cc1ed2ef3', class: "visually-hidden" }, "pagina"))), h("li", { key: '5a1b1027cdcfc8712f6317968a5de914bac0ebd4', class: "current-page" }, "Pagina ", this.visualPage, " van ", this.count), h("li", { key: 'ee74f3f276d08d6fb38f4ea8755bf2d304ba4d4d', onClick: () => this.visualPage === this.page ? this.incrementPage() : null, style: {
                display: this.visualPage === this.count ? "none" : "block",
            }, id: "next", class: "next" }, h("a", { key: '4041301c12516873fcd55325ad97905901405291', class: "standalone-link" }, "Volgende", h("span", { key: '2e03050e7e19ce11320beb28e861d1beca17b87f', class: "visually-hidden" }, "pagina"))))))));
    }
};
LodTable.style = LodTableStyle0;

export { LodTable as lod_table };

//# sourceMappingURL=lod-table.entry.js.map