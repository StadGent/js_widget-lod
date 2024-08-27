import { Component, Prop, State, h } from "@stencil/core";

@Component({
  tag: "article-preview-list",
  styleUrl: "article-preview-list.scss",
  shadow: false,
})
export class ArticlePreviewList {
  @Prop() endpoint: string;
  @Prop() query: string;
  @Prop() countquery: string;
  @Prop() itemsperpage: string;
  @Prop() ctatext: string;
  @Prop() ctaurl: string;

  @State() queryModified: string;
  @State() count: number = 0;
  @State() page: number = 1;
  @State() headers: string[];
  @State() items: any[];
  @State() paginationString: string;
  @State() itemsPerPage: number = 10;
  @State() pagesResult: { page: number; result: any }[] = [];
  @State() currentItem: any;
  @State() isFetching: boolean = false;

  componentWillLoad() {
    this.queryModified = this.query;
    if (
      this.itemsperpage &&
      this.itemsperpage !== "" &&
      Number(this.itemsperpage)
    ) {
      this.itemsPerPage = Number(this.itemsperpage);
    }
    this.paginationString = `LIMIT ${this.itemsPerPage} OFFSET ${this.itemsPerPage * this.page - this.itemsPerPage}`;
    this.queryModified += ` ${this.paginationString}`;
    this.executeQuery();
    this.executeCountQuery();
  }

  formatHeader(input: string) {
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
    url.searchParams.set("query", this.countquery);

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

        const filteredHeaders = result.head.vars.filter(
          (header) => !header.startsWith("_"),
        );

        this.headers = filteredHeaders;

        const data = result.results.bindings;

        this.pagesResult.push({
          page: this.page,
          result: data,
        });

        this.currentItem = data;
      } else {
        console.log("Error when getting data.");
        console.log(this.queryModified);
      }
    } else {
      this.currentItem = this.pagesResult.find(
        (res) => res.page === this.page,
      ).result;
    }
  }

  get queryWithoutLimit() {
    return this.queryModified.replace(
      new RegExp(`${this.paginationString}(?=\\s*$)`),
      "",
    );
  }

  decrementPage() {
    if (this.page > 1) {
      this.queryModified = this.queryWithoutLimit;
      this.page -= 1;
      this.paginationString = `LIMIT ${this.itemsPerPage} OFFSET ${this.itemsPerPage * this.page - this.itemsPerPage}`;
      this.queryModified += this.paginationString;
      this.executeQuery();
    }
  }

  incrementPage() {
    if (this.page < this.count) {
      this.queryModified = this.queryWithoutLimit;
      this.page += 1;
      this.paginationString = `LIMIT ${this.itemsPerPage} OFFSET ${this.itemsPerPage * this.page - this.itemsPerPage}`;
      this.queryModified += this.paginationString;
      this.executeQuery();
    }
  }

  formatValue(item: any) {
    if (item.datatype === "http://www.w3.org/2001/XMLSchema#dateTime") {
      var dateString = item.value;

      const date = new Date(dateString);
      return date.toLocaleString(["nl-BE"], {
        weekday: "short",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } else return item.value;
  }

  render() {
    if (this.count !== 0 && this.currentItem) {
      return (
        <div class="article-preview-list">
          <span class="results-text">
            <b>Er zijn {this.count} resultaten</b>
          </span>
          <ul class="filter__results">
            {this.currentItem?.map((item) => (
              <lod-card
                tag={item["tag"]?.value}
                address={item["loc"]?.value}
                title={"test"}
                imageUrl={item["img"]?.value}
                description={item["txt"]?.value}
                readMoreUrl={item["url"]?.value}
              />
            ))}
          </ul>
          <a
            class="cta-btn"
            href={
              this.ctaurl && this.ctaurl !== ""
                ? this.ctaurl
                : `${this.queryUrl.toString()}`
            }
          >
            {this.ctatext ?? "Bekijk de data via ons SPARQL-endpoint"}
          </a>
          {this.count !== 0 && this.currentItem && (
            <nav class="pager" aria-labelledby="pagination_1-55553">
              <h2 id="pagination_1-55553" class="visually-hidden">
                Pagination
              </h2>

              <ul class="pager__items">
                <li
                  onClick={() =>
                    this.isFetching ? null : this.decrementPage()
                  }
                  style={{ display: this.page === 1 ? "none" : "block" }}
                  id="previous"
                  class="previous"
                >
                  <a class="standalone-link back">
                    Vorige
                    <span class="visually-hidden">pagina</span>
                  </a>
                </li>
                <li class="current-page">
                  Pagina {this.page} van {this.count}
                </li>

                <li id="next" class="next">
                  <a
                    onClick={() =>
                      this.isFetching ? null : this.incrementPage()
                    }
                    class="standalone-link"
                    style={{
                      display: this.page == this.count ? "none" : "block",
                    }}
                  >
                    Volgende
                    <span class="visually-hidden">pagina</span>
                  </a>
                </li>
              </ul>
            </nav>
          )}
        </div>
      );
    }
  }
}
