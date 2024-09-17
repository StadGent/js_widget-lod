import { Component, Prop, State, h } from "@stencil/core";
import {
  getFormattedObjectValue,
  getQueryWithoutLimit,
} from "../../utils/utils";

interface DataItem {
  type: string;
  value: string;
  datatype?: string;
}

interface DataObject {
  [key: string]: DataItem;
}

@Component({
  tag: "lod-cards",
  styleUrl: "lod-cards.scss",
  shadow: false,
})
export class LodCards {
  /**
   * The SparQL Endpoint
   */
  @Prop() endpoint!: string;
  /**
   * The query
   */
  @Prop() query!: string;
  /**
   * The count query
   */
  @Prop() countQuery!: string;
  /**
   * Maximum items per page
   */
  @Prop() itemsPerPage: number = 10;
  /**
   * Custom call to action text
   */
  @Prop() ctaText: string;
  /**
   * Custom call to action url
   */
  @Prop() ctaUrl: string;
  /**
   * Wether to hide the pager or not
   */
  @Prop() pagerDisabled: boolean = false;

  @State() queryModified: string;
  @State() count: number = 0;
  @State() page: number = 1;
  @State() items: any[];
  @State() paginationString: string;
  @State() pagesResult: { page: number; result: any }[] = [];
  @State() currentPageItems: any;
  @State() isFetching: boolean = false;
  @State() visualPage: number = 1;
  @State() errorFetching: boolean = false;

  componentWillLoad() {
    this.queryModified = this.query;

    this.paginationString = `LIMIT ${this.itemsPerPage} OFFSET ${this.itemsPerPage * this.page - this.itemsPerPage}`;
    this.queryModified += ` ${this.paginationString}`;
    this.executeQuery();
    if (!this.pagerDisabled) {
      this.executeCountQuery();
    }
  }

  get readMoreUrl() {
    const url = new URL(this.endpoint);
    url.searchParams.set("query", this.query);
    return url;
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
      const result: any = await response.json();
      this.count = Number(result.results.bindings[0].count.value);
      this.isFetching = false;
    } else {
      console.log("Error when getting count data.");
      console.log(this.queryModified);
      this.errorFetching = true;
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
        const result: any = await response.json();

        const data = result.results.bindings;

        this.pagesResult.push({
          page: this.page,
          result: data,
        });

        this.currentPageItems = data;
      } else {
        console.log("Error when getting data.");
        console.log(this.queryModified);
        this.errorFetching = true;
      }
    } else {
      this.currentPageItems = this.pagesResult.find(
        (res) => res.page === this.page,
      ).result;
    }
  }

  get queryWithoutLimit() {
    return getQueryWithoutLimit(this.queryModified, this.paginationString);
  }

  async decrementPage() {
    if (this.page > 1) {
      this.queryModified = this.queryWithoutLimit;
      this.page -= 1;

      this.paginationString = `LIMIT ${this.itemsPerPage} OFFSET ${this.itemsPerPage * this.page - this.itemsPerPage}`;
      this.queryModified += this.paginationString;
      await this.executeQuery();
      this.visualPage -= 1;
    }
  }

  async incrementPage() {
    if (this.page < this.count) {
      this.queryModified = this.queryWithoutLimit;
      this.page += 1;
      this.paginationString = `LIMIT ${this.itemsPerPage} OFFSET ${this.itemsPerPage * this.page - this.itemsPerPage}`;
      this.queryModified += this.paginationString;
      await this.executeQuery();
      this.visualPage += 1;
    }
  }

  getTitle(data: DataObject): string | undefined {
    for (const key in data) {
      if (!key.startsWith("_")) {
        return data[key].value; // Return the "value" of the first item without an underscore.
      }
    }
    return undefined; // Return undefined if no valid key is found.
  }

  render() {
    if (
      (this.count !== 0 && this.currentPageItems) ||
      (this.pagerDisabled && this.currentPageItems)
    ) {
      return (
        <div class="lod-cards">
          {!this.pagerDisabled && (
            <span class="results-text">
              <b>Er zijn {this.count} resultaten.</b>
            </span>
          )}

          <ul class="filter__results">
            {this.currentPageItems?.map((item) => (
              <lod-card
                tag={item["cat"]?.value}
                address={item["loc"]?.value}
                card-title={this.getTitle(item)}
                image-url={item["img"]?.value}
                description={item["txt"]?.value}
                read-more-url={item["url"]?.value}
                date={getFormattedObjectValue(item["dat"])}
              />
            ))}
          </ul>
          <a
            class="cta-btn"
            href={
              this.ctaUrl && this.ctaUrl !== ""
                ? this.ctaUrl
                : `${this.readMoreUrl.toString()}`
            }
          >
            {this.ctaText ?? "Bekijk de data via ons SPARQL-endpoint"}
          </a>
          {this.count !== 0 && this.currentPageItems && (
            <nav class="pager" aria-labelledby="pagination_1-55553">
              <h2 id="pagination_1-55553" class="visually-hidden">
                Pagination
              </h2>

              <ul class="pager__items">
                <li
                  onClick={() =>
                    this.visualPage === this.page ? this.decrementPage() : null
                  }
                  style={{ display: this.visualPage === 1 ? "none" : "block" }}
                  id="previous"
                  class="previous"
                >
                  <a class="standalone-link back">
                    Vorige
                    <span class="visually-hidden">pagina</span>
                  </a>
                </li>
                <li class="current-page">
                  Pagina {this.visualPage} van {this.count}
                </li>

                <li
                  onClick={() =>
                    this.visualPage === this.page ? this.incrementPage() : null
                  }
                  style={{
                    display: this.visualPage == this.count ? "none" : "block",
                  }}
                  id="next"
                  class="next"
                >
                  <a class="standalone-link">
                    Volgende
                    <span class="visually-hidden">pagina</span>
                  </a>
                </li>
              </ul>
            </nav>
          )}
        </div>
      );
    } else if (
      (this.count === 0 && this.currentPageItems && !this.pagerDisabled) ||
      this.errorFetching
    ) {
      return <h2>No items found with this query</h2>;
    }
  }
}
