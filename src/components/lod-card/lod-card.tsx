import { Component, Prop, h } from "@stencil/core";

@Component({
  tag: "lod-card",
  styleUrl: "lod-card.scss",
  shadow: false,
})
export class LodCard {
  @Prop() articleTitle: string;
  @Prop() description: string;
  @Prop() address: string;
  @Prop() addressUrl: string;
  @Prop() date: string;
  @Prop() tag: string;
  @Prop() imageUrl: string;
  @Prop() readMoreText: string;
  @Prop() readMoreUrl: string;

  private get tagSplitted(): string[] {
    return this.tag?.split(";");
  }

  private get imageUrlFormatted() {
    const imageUrl = this.imageUrl;
    return imageUrl && imageUrl !== ""
      ? imageUrl
      : "https://via.placeholder.com/570x570&text=8:5+(570x570)";
  }

  private get readMoreTextFormatted() {
    const readMoreText = this.readMoreText;
    return readMoreText && readMoreText !== "" ? readMoreText : "Lees meer";
  }

  render() {
    return (
      <li class="teaser teaser--wide">
        <article class="teaser-content">
          <div class="content__second">
            <h3 class="h4">{this.articleTitle}</h3>

            <div class="tag-list-wrapper">
              <ul class="tag-list">
                {this.tagSplitted?.map((tag) => (
                  <li>
                    <span class="tag"> {tag} </span>
                  </li>
                ))}
              </ul>
            </div>

            <div class="article-preview__description">
              {this.description && this.description !== "" && (
                <p>{this.description}</p>
              )}

              {this.address && this.address !== "" && (
                <a
                  target="_blank"
                  href={`https://maps.google.com/maps?q=${this.address}`}
                >
                  {this.address}
                </a>
              )}
              {this.date && this.date !== "" && <time>20 augustus</time>}
            </div>
            <a href={this.readMoreUrl} class="read-more standalone-link">
              {this.readMoreTextFormatted}
              <span class="visually-hidden"> over {this.articleTitle} </span>
            </a>
          </div>

          <div class="content__first">
            <div class="tags-label-wrapper"></div>

            <div class="figure-wrapper">
              <figure>
                <div class="image-wrapper" data-ratio="1:1">
                  <img
                    width="280"
                    height="280"
                    src={this.imageUrlFormatted}
                    alt=""
                  />
                </div>
              </figure>
            </div>
          </div>
        </article>
        <a
          href="#"
          class="teaser-overlay-link"
          tabIndex={-1}
          aria-hidden="true"
        >
          {this.readMoreText}
        </a>
      </li>
    );
  }
}
