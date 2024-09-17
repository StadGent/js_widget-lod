import { Component, Prop, State, h } from "@stencil/core";

@Component({
  tag: "lod-decisions-list",
  styleUrl: "lod-decisions-list.scss",
  shadow: false,
})
export class LodDecisionList {
  /**
   * Sparql endpoint
   */
  @Prop() endpoint!: string;
  /**
   * Max amount of items per page
   */
  @Prop() limit: number = 10;
  /**
   * Boolean to decide if pager is shown or not
   */
  @Prop() statusses: string;
  /**
   * Start date
   */
  @Prop() startDate: string;
  /**
   * End Date
   */
  @Prop() endDate: string;
  /**
   * Boolean to decide if pager is shown or not
   */
  @Prop() pagerDisabled: boolean = false;
  /**
   * Taxonomy url
   */
  @Prop() taxonomy: string;
  /**
   * Concepts url
   */
  @Prop() concepts: string;
  /**
   * Organs url
   */
  @Prop() organs: string;

  @State() offset: number = 0;

  @State() maxCount: number = 1000;

  @State() selectQuery: string;

  @State() pager: string;

  @State() countQuery: string;

  @State() decisions: any[];

  @State() currentPage = Math.floor(this.offset / this.limit) + 1;

  @State() totalPages = Math.ceil(this.maxCount / this.limit);

  componentWillLoad() {}

  async executeQuery(query) {
    const endpoint = this.endpoint + "?query=" + encodeURIComponent(query);
    const response = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/sparql-results+json",
      },
    });

    if (response.ok) {
      const json = await response.json();
      return json;
    } else {
      console.log("Error when getting data.");
      console.log(query);
    }
  }

  async getBesluiten() {
    let query = this.constructQuery();
    if (this.pager) {
      let count = await this.executeQuery(this.countQuery);
      this.maxCount = count.results.bindings[0]["count"].value;
      console.log(this.maxCount);
    }

    let json = await this.executeQuery(this.selectQuery);
    if (json) {
      this.decisions = json.results.bindings;
    }
  }

  constructQuery() {
    const statussen = this.statusses;
    const bestuurseenheden = this.organs;
    const bestuursorganen = this.organs;
    const taxonomy =
      this.taxonomy || "http://stad.gent/id/concepts/decision_making_themes";
    const concepts = this.concepts;
    let filterparams = "";
    if (statussen) {
      const statussenArray = statussen.split(",");
      filterparams +=
        "VALUES ?status { " +
        statussenArray.map((status) => `"${status.trim()}"@nl`).join(" ") +
        " }";
    } else {
      filterparams += `BIND(COALESCE(?status, "Ontwerp") AS ?status)`;
    }
    if (bestuurseenheden) {
      const bestuurseenhedenArray = bestuurseenheden.split(" ");
      filterparams +=
        "VALUES ?bestuureenheidURI { " +
        bestuurseenhedenArray
          .map((bestuurseenheid) => `<${bestuurseenheid.trim()}>`)
          .join(" ") +
        " }";
    }
    if (bestuursorganen) {
      const bestuursorganenArray = bestuursorganen.split(" ");
      filterparams +=
        "VALUES ?bestuursorgaanURI { " +
        bestuursorganenArray
          .map((bestuursorgaan) => `<${bestuursorgaan.trim()}>`)
          .join(" ") +
        " }";
    }

    // Date filter.

    if (this.startDate && this.endDate) {
      filterparams += `FILTER(?zitting_datum >= "${this.startDate}"^^xsd:date && ?zitting_datum <= "${this.endDate}"^^xsd:date)`;
      console.log(filterparams);
    } else if (this.startDate) {
      filterparams += `FILTER(?zitting_datum >= "${this.startDate}"^^xsd:date)`;
    } else if (this.endDate) {
      filterparams += `FILTER(?zitting_datum <= "${this.endDate}"^^xsd:date)`;
    }

    let queryBestuursorgaan = `
        prov:wasGeneratedBy/dct:subject ?agendapunt .

      ?zitting besluit:behandelt ?agendapunt ;
        besluit:geplandeStart ?zitting_datum ;
        besluit:isGehoudenDoor/mandaat:isTijdspecialisatieVan ?bestuursorgaanURI .`;
    let queryBestuurseenheid = `?bestuursorgaanURI besluit:bestuurt ?bestuureenheidURI.`;
    let queryThema = "";
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

    // @TODO: remove OPTIONAL {} when eenheden are available.
    let queryOptional = `OPTIONAL {${queryBestuurseenheid}}`;

    // @TODO: remove OPTIONAL {} when statusses are available.
    queryOptional += `OPTIONAL { ?besluit prov:wasGeneratedBy/besluit:heeftStemming/besluit:gevolg ?status }`;

    // @TODO: remove with query below after Bestuursorgaan has been moved to Zitting iso BehandelingVanAgendapunt
    const endpoint = this.endpoint;
    if (endpoint.includes("probe")) {
      queryBestuursorgaan = `
        prov:wasGeneratedBy ?behandelingVanAgendapunt .
        ?behandelingVanAgendapunt dct:subject ?agendapunt .
        ?agendapunt ^besluit:behandelt ?zitting .
        ?zitting besluit:isGehoudenDoor ?bestuursorgaanURI ;
          besluit:geplandeStart ?zitting_datum.
      `;
    }

    let orderbyClause = "ORDER BY DESC(?zitting_datum)";
    let limitClause = `LIMIT ${this.limit}`;
    let offsetClause = `OFFSET ${this.offset}`;

    this.selectQuery = this.getQuery(
      "DISTINCT ?besluit ?title ?agendapunt ?zitting_datum ?orgaan ?url ?status",
      queryBestuursorgaan,
      queryThema,
      filterparams,
      queryOptional,
      orderbyClause,
      limitClause,
      offsetClause,
    );

    this.countQuery = this.getQuery(
      "(COUNT(DISTINCT(?besluit)) AS ?count)",
      queryBestuursorgaan,
      queryThema,
      filterparams,
      queryOptional,
    );

    return this.selectQuery;
  }

  getQuery(
    fields,
    queryBestuursorgaan,
    queryThema,
    filterparams,
    optionalQuery,
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
        ${queryBestuursorgaan}

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

  pageUp() {
    this.offset += this.limit;
    console.log(this.offset);
    this.getBesluiten();
  }

  pageDown() {
    if (this.offset >= this.limit) {
      this.offset -= this.limit;
      console.log(this.offset);
      this.getBesluiten();
    }
  }

  getPager() {
    let previous = "";
    let next = "";
    let currentPage = Math.floor(this.offset / this.limit) + 1;
    let totalPages = Math.ceil(this.maxCount / this.limit);

    if (this.offset >= this.limit) {
      previous = `
        <li class="previous" id="js-pager-previous"><a href="#" class="standalone-link back">
            Vorige
            <span class="visually-hidden">pagina</span></a></li>
      `;
    }

    if (this.offset < this.maxCount - this.limit) {
      next = `
        <li class="next" id="js-pager-next"><a href="#" class="standalone-link">
            Volgende
            <span class="visually-hidden">pagina</span></a></li>
      `;
    }

    return `
    <nav class="pager" aria-labelledby="pagination">
      <h2 id="pagination" class="visually-hidden">Paginatie</h2>
      <ul class="pager__items">
        ${previous}
        <li class="current-page">Pagina ${currentPage} van ${totalPages}</li>
        ${next}
      </ul>
    </nav>
    `;
  }

  render() {
    if (this.decisions && this.decisions.length > 0) {
      return (
        <div id="template-besluiten-lijst">
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Fira+Sans:400,600,700"
          />
          <link
            rel="stylesheet"
            href="https://stijlgids.stad.gent/v6/css/styleguide.css"
          />
          <link
            rel="stylesheet"
            href="https://stijlgids.stad.gent/v6/css/main.css"
          />
          <link
            rel="stylesheet"
            href="https://stadgent.github.io/js_widget-besluiten/besluiten-lijst/besluiten-lijst.css"
          />

          <div class="resolutions-list cs--blue">
            <section class="highlight">
              <div class="highlight__inner">
                <slot name="title" class="h3">
                  Recente besluiten
                </slot>

                <div class="resolutions-list__items js-resolutions-items">
                  {this.decisions.map((decision) => {
                    <lod-decision-card
                      decisionTitle={decision.title.value}
                      organ={decision.orgaan.value}
                      date={decision.zitting_datum.value}
                      url={decision.url.value}
                      status={decision.status?.value || ""}
                    ></lod-decision-card>;
                  })}
                </div>

                <div class="pager">
                  <nav class="pager" aria-labelledby="pagination">
                    <h2 id="pagination" class="visually-hidden">
                      Paginatie
                    </h2>
                    <ul class="pager__items">
                      <li class="previous" id="js-pager-previous">
                        <a href="#" class="standalone-link back">
                          Vorige
                          <span class="visually-hidden">pagina</span>
                        </a>
                      </li>
                      <li class="current-page">
                        Pagina ${currentPage} van ${totalPages}
                      </li>
                      <li class="next" id="js-pager-next">
                        <a href="#" class="standalone-link">
                          Volgende
                          <span class="visually-hidden">pagina</span>
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>

                <slot name="raadpleegomgeving">
                  <a
                    href="https://ebesluitvorming.gent.be/"
                    class="button button-primary"
                  >
                    Alle besluiten van Stad Gent
                  </a>
                </slot>
              </div>
            </section>
          </div>
        </div>
      );
    }
  }
}
