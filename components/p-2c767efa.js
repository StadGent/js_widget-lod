import { p as proxyCustomElement, H, h } from './p-a8bc01a6.js';

const lodCardCss = ".sr-only{position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden}.lod-card .content__second .read-more{align-self:flex-start}.lod-card__description{display:flex;flex-direction:column;gap:10px;margin-bottom:20px}.lod-card__description #previous,.lod-card__description #next{cursor:pointer}.lod-card__description p{margin:0}.lod-card__description a{align-self:flex-start;font-size:14px;line-height:24px;font-weight:400;border-bottom-width:1px;margin-left:21px;cursor:pointer}.lod-card__description a:before{content:url(\"./assets/location.svg\");width:16px;height:16px;margin-left:0;border-bottom:0;position:absolute;vertical-align:-50%;left:-21px;padding-top:1px}.lod-card__description time{align-self:flex-start;font-size:14px;line-height:24px;font-weight:400;border-bottom-width:1px;margin-left:21px;cursor:pointer}.lod-card__description time:before{content:url(\"./assets/clock.svg\");width:16px;height:16px;margin-left:0;border-bottom:0;position:absolute;vertical-align:-50%;left:0;padding-top:3px}";
const LodCardStyle0 = lodCardCss;

const LodCard = /*@__PURE__*/ proxyCustomElement(class LodCard extends H {
    constructor() {
        super();
        this.__registerHost();
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
    static get style() { return LodCardStyle0; }
}, [0, "lod-card", {
        "cardTitle": [1, "card-title"],
        "description": [1],
        "address": [1],
        "addressUrl": [1, "address-url"],
        "date": [1],
        "tag": [1],
        "imageUrl": [1, "image-url"],
        "readMoreText": [1, "read-more-text"],
        "readMoreUrl": [1, "read-more-url"]
    }]);
function defineCustomElement() {
    if (typeof customElements === "undefined") {
        return;
    }
    const components = ["lod-card"];
    components.forEach(tagName => { switch (tagName) {
        case "lod-card":
            if (!customElements.get(tagName)) {
                customElements.define(tagName, LodCard);
            }
            break;
    } });
}
defineCustomElement();

export { LodCard as L, defineCustomElement as d };

//# sourceMappingURL=p-2c767efa.js.map