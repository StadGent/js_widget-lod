import { Component, Prop, State, h } from "@stencil/core";

@Component({
  tag: "lod-decisions-list",
  styleUrl: "lod-decisions-list.scss",
  shadow: false,
})
export class LodDecisionsList {
  /**
   * The SparQL Endpoint
   */
  @Prop() endpoint!: string;
  /**
   * The query
   */
  @Prop() itemsPerPage: number = 5;
  /**
   * Taxonomy
   */
  @Prop() taxonomy: string;
  /**
   * Concepts
   */
  @Prop() concepts: string;
  /**
   * Governing bodies (bestuursorganen)
   */
  @Prop() governingBodies: string;
  /**
   * Statusses
   */
  @Prop() statusses: string;
  /**
   * Start date of the decisions
   */
  @Prop() startDate: string;
  /**
   * End date of the decisions
   */
  @Prop() endDate: string;
  /**
   * Governing Units (bestuurseenheden)
   */
  @Prop() governingUnits: string;
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
  @State() selectQuery: string;
  @State() countQuery: string;

  componentWillLoad() {
    this.executeQuery();
    if (!this.pagerDisabled) {
      this.executeCountQuery();
    }
  }

  get constructQuery() {
    let filterparams = "";
    if (this.statusses && this.statusses.length > 0) {
      const statussenArray = this.statusses.split(",");
      // NOTE: adding query part here, status is not optional when filtering on status
      filterparams += `?besluit prov:wasGeneratedBy/besluit:heeftStemming/besluit:gevolg ?status. \n`;
      filterparams +=
        "VALUES ?status { " +
        statussenArray.map((status) => `"${status.trim()}"@nl`).join(" ") +
        " }";
    } else {
      // TODO: adding query part here, status is ONLY optional when not filtering on status
      filterparams += `OPTIONAL { ?besluit prov:wasGeneratedBy/besluit:heeftStemming/besluit:gevolg ?status }`;
      filterparams += `BIND(COALESCE(?status, "Onbekend"@nl) AS ?status)`;
    }
    if (this.governingUnits && this.governingUnits.length > 0) {
      const governingUnitesArray = this.governingUnits.split(" ");
      filterparams +=
        "VALUES ?bestuureenheidURI { " +
        governingUnitesArray.map((unit) => `<${unit.trim()}>`).join(" ") +
        " }";
    }
    if (this.governingBodies && this.governingBodies.length > 0) {
      const governingBodiesArray = this.governingBodies.split(" ");
      filterparams +=
        "VALUES ?bestuursorgaanURI { " +
        governingBodiesArray.map((body) => `<${body.trim()}>`).join(" ") +
        " }";
    }

    // Date filter.
    if (
      this.startDate &&
      this.endDate &&
      this.startDate.length > 0 &&
      this.endDate.length > 0
    ) {
      filterparams += `FILTER(?zitting_datum >= "${this.startDate}"^^xsd:date && ?zitting_datum <= "${this.endDate}"^^xsd:date)`;
    } else if (this.startDate && this.startDate.length > 0) {
      filterparams += `FILTER(?zitting_datum >= "${this.startDate}"^^xsd:date)`;
    } else if (this.endDate && this.endDate.length > 0) {
      filterparams += `FILTER(?zitting_datum <= "${this.endDate}"^^xsd:date)`;
    }

    let queryGoverningBody = `
        prov:wasGeneratedBy/dct:subject ?agendapunt .

      ?zitting besluit:behandelt ?agendapunt ;
        besluit:geplandeStart ?zitting_datum ;
        besluit:isGehoudenDoor/mandaat:isTijdspecialisatieVan ?bestuursorgaanURI .`;
    let queryGoverningUnit = `?bestuursorgaanURI besluit:bestuurt ?bestuureenheidURI.`;
    let queryThema = "";
    if (this.concepts && this.concepts.length > 0) {
      const conceptsArray = this.concepts.split(" ");
      queryThema =
        `
        ?besluit ext:hasAnnotation ?annotation .
        ?annotation ext:withTaxonomy ?thema ;
                             ext:creationDate ?date ;
                             ext:hasLabel ?label .
        ?label ext:isTaxonomy ?concept .
        VALUES ?thema { <${this.taxonomy}> }
        VALUES ?concept { ` +
        conceptsArray.map((concept) => `<${concept.trim()}>`).join(" ") +
        ` }
        FILTER (!CONTAINS(STR(?url), "/notulen"))
        FILTER (!CONTAINS(STR(?orgaan), "personeel"))
        FILTER (!CONTAINS(STR(?orgaan), "gemeenteraad"))
      `;
    }

    // @TODO: remove OPTIONAL {} when eenheden are available.
    let queryOptional = `OPTIONAL {${queryGoverningUnit}}`;

    // @TODO: remove with query below after Bestuursorgaan has been moved to Zitting iso BehandelingVanAgendapunt
    if (this.endpoint.includes("probe")) {
      queryGoverningBody = `
        prov:wasGeneratedBy ?behandelingVanAgendapunt .
        ?behandelingVanAgendapunt dct:subject ?agendapunt .
        ?agendapunt ^besluit:behandelt ?zitting .
        ?zitting besluit:isGehoudenDoor ?bestuursorgaanURI ;
          besluit:geplandeStart ?zitting_datum.
      `;
    }

    let orderbyClause = "ORDER BY DESC(?zitting_datum)";
    let limitClause = `LIMIT ${this.itemsPerPage}`;
    let offsetClause = `OFFSET ${this.itemsPerPage * this.page - this.itemsPerPage}`;

    this.selectQuery = this.getQuery(
      "DISTINCT ?besluit ?title ?agendapunt ?zitting_datum ?orgaan ?url ?status",
      queryGoverningBody,
      queryThema,
      filterparams,
      queryOptional,
      orderbyClause,
      limitClause,
      offsetClause,
    );

    this.countQuery = this.getQuery(
      "(COUNT(DISTINCT(?besluit)) AS ?count)",
      queryGoverningBody,
      queryThema,
      filterparams,
      queryOptional,
    );

    return this.selectQuery;
  }

  getQuery(
    fields: string,
    queryGoverningBody: string,
    queryThema: string,
    filterparams: string,
    optionalQuery: string,
    orderbyClause = "",
    limitClause = "",
    offsetClause = "",
  ) {
    return `
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX prov: <http://www.w3.org/ns/prov#>
      PREFIX eli: <http://data.europa.eu/eli/ontology#>
      PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
      PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>

      SELECT
        ${fields}
      WHERE {
        ?besluit a besluit:Besluit ;
          eli:title_short ?title ;
          prov:wasDerivedFrom ?url ;
        ${queryGoverningBody}

        ?bestuursorgaanURI skos:prefLabel ?orgaanLabel .
        ${queryThema}
        ${optionalQuery}
        ${filterparams}
        BIND(CONCAT(UCASE(SUBSTR(?orgaanLabel, 1, 1)), SUBSTR(?orgaanLabel, 2)) AS ?orgaan)
      }
      ${orderbyClause}
      ${limitClause}
      ${offsetClause}
    `;
  }

  get queryUrl() {
    const url = new URL(this.endpoint);
    url.searchParams.set("query", this.constructQuery);
    return url;
  }

  async executeCountQuery() {
    const url = new URL(this.endpoint);
    this.constructQuery;
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
        this.errorFetching = true;
      }
    } else {
      this.currentPageItems = this.pagesResult.find(
        (res) => res.page === this.page,
      ).result;
    }
  }

  async decrementPage() {
    if (this.page > 1) {
      this.page -= 1;
      await this.executeQuery();
      this.visualPage -= 1;
    }
  }

  async incrementPage() {
    if (this.page < this.count) {
      this.page += 1;
      await this.executeQuery();
      this.visualPage += 1;
    }
  }

  render() {
    if (
      (this.count !== 0 && this.currentPageItems) ||
      (this.pagerDisabled && this.currentPageItems)
    ) {
      return (
        <div class="decisions-list cs--blue">
          <div class="highlight">
            <div class="highlight__inner">
              <slot name="title">
                <span class="h3">Recente besluiten</span>
              </slot>
              <div class="decisions-list__items">
                <ul class="filter__results">
                  {this.currentPageItems?.map((item) => (
                    <li>
                      <lod-decision-card
                        decision-title={item.title.value}
                        organ={item.orgaan.value}
                        date={item.zitting_datum.value}
                        url={item.url.value}
                        status={item.status?.value}
                      ></lod-decision-card>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

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
                  {`Pagina ${this.visualPage} van ${Math.ceil(this.count / this.itemsPerPage)}`}
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
          <slot name="cta">
            <a
              href="https://ebesluitvorming.gent.be/"
              class="button button-primary"
            >
              Alle besluiten van Stad Gent
            </a>
          </slot>
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
