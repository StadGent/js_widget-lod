import { Component, Prop, h } from "@stencil/core";

@Component({
  tag: "lod-card",
  styleUrl: "lod-card.scss",
  shadow: false,
})
export class LodCard {
  /**
   * The title of the card
   */
  @Prop() cardTitle: string;
  /**
   * The card description
   */
  @Prop() description: string;
  /**
   * The location address of the event
   */
  @Prop() address: string;
  /**
   * The date of the event
   */
  @Prop() date: string;
  /**
   * ; Seperated tags to show in the card
   */
  @Prop() tag: string;
  /**
   * Url of the image
   */
  @Prop() imageUrl: string;
  /**
   * Custom read more text
   */
  @Prop() readMoreText: string;
  /**
   * Read more url
   */
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
    console.log(readMoreText);
    console.log(this.readMoreText);
    return readMoreText && readMoreText !== "" ? readMoreText : "Lees meer";
  }

  render() {
    return (
      <li class="lod-card teaser teaser--wide">
        <article class="teaser-content">
          <div class="content__second">
            {this.cardTitle && <h3 class="h4">{this.cardTitle}</h3>}

            {this.tagSplitted?.length > 0 && (
              <div class="tag-list-wrapper">
                <ul class="tag-list">
                  {this.tagSplitted?.map((tag) => (
                    <li>
                      <span class="tag"> {tag} </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div class="lod-card__description">
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
              {this.date && this.date !== "" && <time>{this.date}</time>}
            </div>

            {this.readMoreUrl && (
              <a href={this.readMoreUrl} class="read-more standalone-link">
                {this.readMoreTextFormatted}
                <span class="visually-hidden"> over {this.cardTitle} </span>
              </a>
            )}
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
        {this.readMoreUrl && (
          <a
            href={this.readMoreUrl}
            class="teaser-overlay-link"
            tabIndex={-1}
            aria-hidden="true"
          >
            {this.readMoreTextFormatted}
          </a>
        )}
      </li>
    );
  }
}
