import { Component, Prop, State, h } from "@stencil/core";

@Component({
  tag: "lod-regulations-list",
  styleUrl: "lod-regulations-list.scss",
  shadow: false,
})
export class LodRegulationsList {
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
   * Types
   */
  @Prop() types: string;
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

  private regulationTypes = {
    "https://data.vlaanderen.be/id/concept/BesluitType/0d1278af-b69e-4152-a418-ec5cfd1c7d0b":
      "Aanvullend reglement op het wegverkeer m.b.t. gemeentewegen in speciale beschermingszones",
    "https://data.vlaanderen.be/id/concept/BesluitType/256bd04a-b74b-4f2a-8f5d-14dda4765af9":
      "Tijdelijke politieverordening (op het wegverkeer)",
    "https://data.vlaanderen.be/id/concept/BesluitType/25deb453-ae3e-4d40-8027-36cdb48ab738":
      "Deontologische Code",
    "https://data.vlaanderen.be/id/concept/BesluitType/3bba9f10-faff-49a6-acaa-85af7f2199a3":
      "Aanvullend reglement op het wegverkeer m.b.t. gemeentewegen in havengebied",
    "https://data.vlaanderen.be/id/concept/BesluitType/4673d472-8dbc-4cea-b3ab-f92df3807eb3":
      "Personeelsreglement",
    "https://data.vlaanderen.be/id/concept/BesluitType/4d8f678a-6fa4-4d5f-a2a1-80974e43bf34":
      "Aanvullend reglement op het wegverkeer enkel m.b.t. gemeentewegen (niet in havengebied of speciale beschermingszones)",
    "https://data.vlaanderen.be/id/concept/BesluitType/5ee63f84-2fa0-4758-8820-99dca2bdce7c":
      "Delegatiereglement",
    "https://data.vlaanderen.be/id/concept/BesluitType/7d95fd2e-3cc9-4a4c-a58e-0fbc408c2f9b":
      "Aanvullend reglement op het wegverkeer m.b.t. één of meerdere gewestwegen",
    "https://data.vlaanderen.be/id/concept/BesluitType/84121221-4217-40e3-ada2-cd1379b168e1":
      "Andere",
    "https://data.vlaanderen.be/id/concept/BesluitType/a8486fa3-6375-494d-aa48-e34289b87d5b":
      "Huishoudelijk reglement",
    "https://data.vlaanderen.be/id/concept/BesluitType/ba5922c9-cfad-4b2e-b203-36479219ba56":
      "Retributiereglement",
    "https://data.vlaanderen.be/id/concept/BesluitType/d7060f97-c417-474c-abc6-ef006cb61f41":
      "Subsidie, premie, erkenning",
    "https://data.vlaanderen.be/id/concept/BesluitType/e8aee49e-8762-4db2-acfe-2d5dd3c37619":
      "Reglement Onderwijs",
    "https://data.vlaanderen.be/id/concept/BesluitType/e8afe7c5-9640-4db8-8f74-3f023bec3241":
      "Politiereglement",
    "https://data.vlaanderen.be/id/concept/BesluitType/efa4ec5a-b006-453f-985f-f986ebae11bc":
      "Belastingreglement",
    "https://data.vlaanderen.be/id/concept/BesluitType/fb92601a-d189-4482-9922-ab0efc6bc935":
      "Gebruikersreglement",
  };

  componentWillLoad() {
    this.executeQuery();
    if (!this.pagerDisabled) {
      this.executeCountQuery();
    }
  }

  get constructQuery() {
    let filterparams = "";

    // Status filter.
    if (this.statusses) {
      const statussenArray = this.statusses.split(",");
      filterparams +=
        "VALUES ?status { " +
        statussenArray.map((status) => `"${status.trim()}"@nl`).join(" ") +
        " }";
    } else {
      filterparams += `BIND(COALESCE(?status, "Ontwerp") AS ?status)`;
    }

    // Type filter.
    if (this.types) {
      const typesArray = this.types.split(" ");
      filterparams +=
        "VALUES ?type { " +
        typesArray.map((type) => `<${type.trim()}>`).join(" ") +
        " }";
    } else {
      filterparams += `VALUES ?type { ${Object.keys(this.regulationTypes)
        .map((type) => `<${type}>`)
        .join(" ")} }`;
    }

    // Taxonomy filter.
    let queryThema = "";
    const taxonomy =
      this.taxonomy || "http://stad.gent/id/concepts/decision_making_themes";
    const concepts = this.concepts;
    if (concepts) {
      const conceptsArray = concepts.split(" ");
      queryThema =
        `
        ?besluit ext:hasAnnotation ?annotation .
        ?annotation ext:withTaxonomy ?thema ;
                             ext:creationDate ?date ;
                             ext:hasLabel ?label .
        ?label ext:isTaxonomy ?concept .
        VALUES ?thema { <${taxonomy}> }
        VALUES ?concept { ` +
        conceptsArray.map((concept) => `<${concept.trim()}>`).join(" ") +
        ` }
        FILTER (!CONTAINS(STR(?url), "/notulen"))
        FILTER (!CONTAINS(STR(?orgaan), "personeel"))
        FILTER (!CONTAINS(STR(?orgaan), "gemeenteraad"))
      `;
    }

    // Bestuurseenheden filter.

    if (this.governingUnits) {
      const governingUnitesArray = this.governingUnits.split(" ");
      filterparams +=
        "VALUES ?bestuureenheidURI { " +
        governingUnitesArray.map((unit) => `<${unit.trim()}>`).join(" ") +
        " }";
    }

    // Bestuursorganen filter.
    if (this.governingBodies) {
      const governingBodiesArray = this.governingBodies.split(" ");
      filterparams +=
        "VALUES ?bestuursorgaanURI { " +
        governingBodiesArray.map((body) => `<${body.trim()}>`).join(" ") +
        " }";
    }

    // Date filter.
    if (this.startDate && this.endDate) {
      filterparams += `FILTER(?zitting_datum >= "${this.startDate}"^^xsd:date && ?zitting_datum <= "${this.endDate}"^^xsd:date)`;
    } else if (this.startDate) {
      filterparams += `FILTER(?zitting_datum >= "${this.startDate}"^^xsd:date)`;
    } else if (this.endDate) {
      filterparams += `FILTER(?zitting_datum <= "${this.endDate}"^^xsd:date)`;
    }

    let queryGoverningBody = `
        prov:wasGeneratedBy/dct:subject ?agendapunt .

      ?zitting besluit:behandelt ?agendapunt ;
        besluit:isGehoudenDoor/mandaat:isTijdspecialisatieVan ?bestuursorgaanURI .`;

    // TODO: remove with query below after Bestuursorgaan has been moved to Zitting iso BehandelingVanAgendapunt

    if (this.endpoint.includes("probe")) {
      queryGoverningBody = `
        prov:wasGeneratedBy ?behandelingVanAgendapunt .
        ?behandelingVanAgendapunt dct:subject ?agendapunt .
        ?agendapunt ^besluit:behandelt ?zitting .
        ?zitting besluit:isGehoudenDoor ?bestuursorgaanURI ;
          besluit:geplandeStart ?zitting_datum.
        `;
    }

    this.selectQuery = `
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX prov: <http://www.w3.org/ns/prov#>
      PREFIX eli: <http://data.europa.eu/eli/ontology#>
      PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
      PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>

      SELECT
        DISTINCT ?besluit ?title ?publicatie_datum ?agendapunt ?orgaan ?url ?status ?type
      WHERE {
        ?besluit a besluit:Besluit ;
          a ?type ;
          eli:date_publication ?publicatie_datum ;
          eli:title_short ?title ;
          prov:wasDerivedFrom ?url ;
          ${queryGoverningBody}
        ?bestuursorgaanURI skos:prefLabel ?orgaan .
        OPTIONAL { ?bestuursorgaanURI besluit:bestuurt ?bestuureenheidURI . }
        OPTIONAL { ?besluit prov:wasGeneratedBy/besluit:heeftStemming/besluit:gevolg ?status }

        ${queryThema}
        ${filterparams}
        FILTER (!CONTAINS(STR(?url), "/notulen"))
        FILTER (!CONTAINS(STR(?orgaan), "personeel"))
        FILTER (!CONTAINS(STR(?orgaan), "gemeenteraad"))
      }
      ORDER BY DESC(?publicatie_datum)
      LIMIT ${this.itemsPerPage}
      OFFSET ${this.itemsPerPage * this.page - this.itemsPerPage}
      `;

    this.countQuery = `
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX prov: <http://www.w3.org/ns/prov#>
      PREFIX eli: <http://data.europa.eu/eli/ontology#>
      PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
      PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>

      SELECT
        (COUNT(DISTINCT(?besluit)) AS ?count)
      WHERE {
        ?besluit a besluit:Besluit ;
          a ?type ;
          eli:date_publication ?publicatie_datum ;
          eli:title_short ?title ;
          prov:wasDerivedFrom ?url ;
          prov:wasGeneratedBy/besluit:heeftStemming/besluit:gevolg ?status ;
          ${queryGoverningBody}
        ?bestuursorgaanURI skos:prefLabel ?orgaan .
        OPTIONAL { ?bestuursorgaanURI besluit:bestuurt ?bestuureenheidURI . }

        ${queryThema}
        ${filterparams}
        FILTER (!CONTAINS(STR(?url), "/notulen"))
        FILTER (!CONTAINS(STR(?orgaan), "personeel"))
        FILTER (!CONTAINS(STR(?orgaan), "gemeenteraad"))
      }`;

    return this.selectQuery;
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
        <div class="regulations-list cs--blue">
          <div class="highlight">
            <div class="highlight__inner">
              <slot name="title">
                <span class="h3">Recente reglementen</span>
              </slot>
              <div class="regulations-list__items">
                <ul class="filter__results">
                  {this.currentPageItems?.map((item) => (
                    <li>
                      <lod-decision-card
                        decision-title={item?.title?.value}
                        organ={item?.orgaan?.value}
                        date={item?.publicatie_datum?.value}
                        url={item?.url?.value}
                        status={item?.status?.value}
                        type={this.regulationTypes?.[item?.type?.value]}
                        decisionType="regulation"
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
              Alle reglementen van Stad Gent
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
