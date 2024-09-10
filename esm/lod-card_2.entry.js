import { r as registerInstance, h } from './index-f6268475.js';
import { g as getQueryWithoutLimit, a as getFormattedObjectValue } from './utils-fac76af7.js';

const lodCardCss = ".sr-only{position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden}.lod-card .content__second .read-more{align-self:flex-start}.lod-card__description{display:flex;flex-direction:column;gap:10px;margin-bottom:20px}.lod-card__description #previous,.lod-card__description #next{cursor:pointer}.lod-card__description p{margin:0}.lod-card__description a{align-self:flex-start;font-size:14px;line-height:24px;font-weight:400;border-bottom-width:1px;margin-left:21px;cursor:pointer}.lod-card__description a:before{content:url(\"./assets/location.svg\");width:16px;height:16px;margin-left:0;border-bottom:0;position:absolute;vertical-align:-50%;left:-21px;padding-top:1px}.lod-card__description time{align-self:flex-start;font-size:14px;line-height:24px;font-weight:400;border-bottom-width:1px;margin-left:21px;cursor:pointer}.lod-card__description time:before{content:url(\"./assets/clock.svg\");width:16px;height:16px;margin-left:0;border-bottom:0;position:absolute;vertical-align:-50%;left:0;padding-top:3px}";
const LodCardStyle0 = lodCardCss;

const LodCard = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.cardTitle = undefined;
        this.description = undefined;
        this.address = undefined;
        this.addressUrl = undefined;
        this.date = undefined;
        this.tag = undefined;
        this.imageUrl = undefined;
        this.readMoreText = undefined;
        this.readMoreUrl = undefined;
    }
    get tagSplitted() {
        var _a;
        return (_a = this.tag) === null || _a === void 0 ? void 0 : _a.split(";");
    }
    get imageUrlFormatted() {
        const imageUrl = this.imageUrl;
        return imageUrl && imageUrl !== ""
            ? imageUrl
            : "https://via.placeholder.com/570x570&text=8:5+(570x570)";
    }
    get readMoreTextFormatted() {
        const readMoreText = this.readMoreText;
        return readMoreText && readMoreText !== "" ? readMoreText : "Lees meer";
    }
    render() {
        var _a, _b;
        return (h("li", { key: '470ef33de1e73f530babb3364b0d4afffbe2216c', class: "lod-card teaser teaser--wide" }, h("article", { key: 'b3738dfbe68c64385ad3bf490180761451bd312a', class: "teaser-content" }, h("div", { key: '0c8db88d4d9bc6e1cc549c4cf196806d69685eab', class: "content__second" }, h("h3", { key: '5b69e50ecfb560d2fbbdfad9afd5528687e95da7', class: "h4" }, this.cardTitle), ((_a = this.tagSplitted) === null || _a === void 0 ? void 0 : _a.length) > 0 && (h("div", { key: '7e52d5ee3e0c8c131f4d8f641f482a774b7563b3', class: "tag-list-wrapper" }, h("ul", { key: 'f11c3b094284ae5bcd8e4fecb246d8b51092354f', class: "tag-list" }, (_b = this.tagSplitted) === null || _b === void 0 ? void 0 : _b.map((tag) => (h("li", null, h("span", { class: "tag" }, " ", tag, " "))))))), h("div", { key: '5bc31185ee750b50fb5dadc27fc83ffb5980dd0f', class: "lod-card__description" }, this.description && this.description !== "" && (h("p", { key: '751687a12b129860ac790e1342afd6ad2dccd809' }, this.description)), this.address && this.address !== "" && (h("a", { key: '6abe9975ec1c499329265890df2c4753790a1630', target: "_blank", href: `https://maps.google.com/maps?q=${this.address}` }, this.address)), this.date && this.date !== "" && h("time", { key: 'c7e3d6f64400136e960750c036d60b5816338fe0' }, this.date)), h("a", { key: 'd8ea31602be72d13b795cec80a77762fe8291708', href: this.readMoreUrl, class: "read-more standalone-link" }, this.readMoreTextFormatted, h("span", { key: '3d5b71d4148d202e30b41fbdf9275baea2ae0a8b', class: "visually-hidden" }, " over ", this.cardTitle, " "))), h("div", { key: 'e9b6525f776c9a1a194c541010891dd3f63b5b08', class: "content__first" }, h("div", { key: '619e7e8c0fa530d3d69196d043112e32e5b1b80e', class: "tags-label-wrapper" }), h("div", { key: '8c37dff4b44dfbba5be8e95252b00b1dfd3c9386', class: "figure-wrapper" }, h("figure", { key: 'f7ef5b2f3fea397d33577d6077ea3bb5ae18a52c' }, h("div", { key: '752ab408bbb688bbddf48d7c5b91537d0932865a', class: "image-wrapper", "data-ratio": "1:1" }, h("img", { key: '9f8f9f7b3912b33f7296c45b2e6160e0ce921566', width: "280", height: "280", src: this.imageUrlFormatted, alt: "" })))))), h("a", { key: '6385f8778b895c1008597e6847cb5958ec0f71ed', href: "#", class: "teaser-overlay-link", tabIndex: -1, "aria-hidden": "true" }, this.readMoreText)));
    }
};
LodCard.style = LodCardStyle0;

const lodCardsCss = ".sr-only{position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden}.lod-cards{display:flex;flex-direction:column}.lod-cards .pager__items{justify-content:center !important}.lod-cards .results-text{margin-bottom:20px}.lod-cards .cta-btn{align-self:flex-start;font-size:16px;line-height:24px;margin-left:30px;margin-bottom:60px}.lod-cards .cta-btn:before{content:url(\"./assets/share-icon.svg\");width:24px;height:24px;margin-left:0;border-bottom:0;position:absolute;vertical-align:-50%;left:-30px;padding-top:1px}.lod-cards .filter__results{margin-left:0}.lod-cards #previous,.lod-cards #next{cursor:pointer;display:block}";
const LodCardsStyle0 = lodCardsCss;

const LodCards = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
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
};
LodCards.style = LodCardsStyle0;

export { LodCard as lod_card, LodCards as lod_cards };

//# sourceMappingURL=lod-card_2.entry.js.map