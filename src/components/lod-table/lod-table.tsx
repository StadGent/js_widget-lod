import { Component, Fragment, Prop, State, h } from "@stencil/core";
import {
  isNumber,
  getQueryWithoutLimit,
  getFormattedObjectValue,
} from "../../utils/utils";

@Component({
  tag: "lod-table",
  styleUrl: "lod-table.scss",
  shadow: false,
})
export class LodTable {
  @Prop() endpoint: string;
  @Prop() query: string;
  @Prop() countQuery: string;
  @Prop() itemsPerPage: string;
  @Prop() ctaText: string;
  @Prop() ctaUrl: string;
  @Prop() tableCaption: string;

  @State() queryModified: string;
  @State() count: number = 0;
  @State() page: number = 1;
  @State() headers: string[];
  @State() items: any[];
  @State() paginationString: string;
  @State() _itemsPerPage: number = 10;
  @State() pagesResult: { page: number; result: any }[] = [];
  @State() currentPageItems: any;
  @State() isFetching: boolean = false;
  @State() visualPage: number = 1;

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

        this.currentPageItems = data;
      } else {
        console.log("Error when getting data.");
        console.log(this.queryModified);
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
    return (
      <div class="lod-table">
        <div class="responsive-table">
          <div class="table-wrapper">
            <table>
              <tr>
                {this.headers &&
                  this.headers.map((header) => (
                    <th scope="col">{this.formatHeader(header)}</th>
                  ))}
              </tr>
              {this.currentPageItems?.map((item) => (
                <tr>
                  {this.headers &&
                    this.headers.map((header) => (
                      <td>{getFormattedObjectValue(item?.[header])}</td>
                    ))}
                </tr>
              ))}
              {this.tableCaption && this.tableCaption !== "" && (
                <caption class="sr-only">{this.tableCaption}</caption>
              )}
            </table>
          </div>
        </div>

        <div
          aria-labelledby="table-without-row-headers-list-description"
          class="table-list"
        >
          <ul>
            {this.currentPageItems &&
              this.headers &&
              this.currentPageItems.map((item) => (
                <li>
                  <dl>
                    {this.headers &&
                      this.headers.map((header) => (
                        <Fragment>
                          <dt>{this.formatHeader(header)}</dt>
                          <dd>{item?.[header].value}</dd>
                        </Fragment>
                      ))}
                  </dl>
                </li>
              ))}
          </ul>

          {this.tableCaption && this.tableCaption !== "" && (
            <div class="sr-only" id="table-list-description">
              {this.tableCaption}
            </div>
          )}
        </div>
        <a
          class="cta-btn"
          href={
            this.ctaUrl && this.ctaUrl !== ""
              ? this.ctaUrl
              : `${this.queryUrl.toString()}`
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
                  display: this.visualPage === this.count ? "none" : "block",
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
  }
}