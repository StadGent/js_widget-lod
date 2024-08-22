class ArticlePreview extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML += this.render();
  }

  get title() {
    return this.getAttribute("title") ?? "";
  }

  get description() {
    return this.getAttribute("description") ?? "";
  }

  get address() {
    return this.getAttribute("address");
  }

  get addressUrl() {
    return `https://maps.google.com/?q=${this.address}`;
  }

  get tag() {
    return this.getAttribute("tag").split(";");
  }

  get tagFormatted() {
    let tags = "";
    this.tag.forEach(
      (tag) => (tags += `<li><span class="tag"> ${tag} </span></li>`),
    );
    return tags;
  }

  get imageUrl() {
    const imageUrl = this.getAttribute("imageUrl");
    return imageUrl && imageUrl !== ""
      ? imageUrl
      : "https://via.placeholder.com/570x570&text=8:5+(570x570)";
  }

  get readMoreUrl() {
    return this.getAttribute("readMoreUrl");
  }

  get readMoreText() {
    const readMoreText = this.getAttribute("readMoreText");
    return readMoreText && readMoreText !== "" ? readMoreText : "Lees meer";
  }

  render() {
    return /* HTML */ `
      <li class="teaser teaser--wide">
        <article class="teaser-content">
          <div class="content__second">
            <h3 class="h4">${this.title}</h3>

            <div class="tag-list-wrapper">
              <ul class="tag-list">
                ${this.tagFormatted}
              </ul>
            </div>

            <div class="article-preview-description">
              <p>${this.description}</p>
              <a target="_blank" href="${this.addressUrl}">${this.address}</a>
              <time>20 augustus</time>
            </div>
            <a href="${this.readMoreUrl}" class="read-more standalone-link">
              ${this.readMoreText}
              <span class="visually-hidden"> over ${this.title} </span>
            </a>
          </div>

          <div class="content__first">
            <div class="tags-label-wrapper"></div>

            <div class="figure-wrapper">
              <figure>
                <div class="image-wrapper" data-ratio="1:1">
                  <img width="280" height="280" src="${this.imageUrl}" alt="" />
                </div>
              </figure>
            </div>
          </div>
        </article>
        <a href="#" class="teaser-overlay-link" tabindex="-1" aria-hidden="true"
          >${this.readMoreText}</a
        >
      </li>
    `;
  }
}

customElements.define("article-preview", ArticlePreview);
