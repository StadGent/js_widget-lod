import { Component, Fragment, Prop, State, Watch, h } from "@stencil/core";

@Component({
  tag: "lod-decision-card",
  styleUrl: "lod-decision-card.scss",
  shadow: false,
})
export class LodDecisionCard {
  /**
   * Decision title
   */
  @Prop() decisionTitle: string;
  /**
   * Sparql endpoint
   */
  @Prop() endpoint: string;
  /**
   * Decision type
   */
  @Prop() type: string;
  /**
   * Organ of decision
   */
  @Prop() organ: string;
  /**
   * Date of decision
   */
  @Prop() date: string;
  /**
   * Decision url
   */
  @Prop() url: string;
  /**
   * ; Status of decision
   */
  @Prop() status: string;
  /**
   * Uri to get decision
   */
  @Prop() uri: string;

  @Prop() decisionType: "regulation" | "decision";

  @State() uriResult: any;

  @Watch("uriResult")
  watchPropHandler(newBesluit: any) {
    this.decisionTitle = newBesluit.title.value;
    this.organ = "@todo";
    this.date = this.formatDate(newBesluit.date.value);
    this.url = newBesluit.url.value;
    this.status = newBesluit.status.value || "";
  }

  componentWillLoad() {
    if (this.uri && this.uri !== "") {
      this.getBesluit;
    }
  }

  async getBesluit() {
    const endpoint = this.endpoint + "?query=" + encodeURIComponent(this.query);
    const response = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/sparql-results+json",
      },
    });

    if (response.ok) {
      const json = await response.json();
      if (json.results.bindings && json.results.bindings.length > 0) {
        //console.log(JSON.stringify(json.results.bindings));
        this.uriResult = json.results.bindings[0];
      } else {
        console.log("Error when getting data.");
      }
    } else {
      console.log("Error when getting data.");
    }
  }

  get query() {
    return `
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX prov: <http://www.w3.org/ns/prov#>
    PREFIX eli: <http://data.europa.eu/eli/ontology#>
    PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
    
    SELECT ?title ?date ?url ?status WHERE {
      <${this.uri}> a besluit:Besluit ;
        eli:date_publication ?date ;
        eli:title_short ?title ;
        prov:wasGeneratedBy/besluit:heeftStemming/besluit:gevolg ?status ;
        prov:wasDerivedFrom ?url .
    } LIMIT 1`;
  }

  get statusGreen() {
    return [
      "Aanvaard tot de zitting als hoogdringend agendapunt",
      "Goedgekeurd",
      "Behandeld",
    ].includes(this.status);
  }

  formatDate(date: string) {
    let dateObject = new Date(date);
    let d = dateObject.toLocaleDateString("nl-be", {
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    let t = dateObject.toLocaleTimeString("nl-be", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
    return `${d} om ${t}`;
  }

  get statusRed() {
    return ["Afgekeurd", "Afgevoerd", "Geweigerd", "Ingetrokken"].includes(
      this.status,
    );
  }

  get statusNa() {
    return ["Gedeeltelijke ingetrokken", "Verdaagd"].includes(this.status);
  }

  render() {
    if ((this.uri && this.uriResult) || !this.uri) {
      return (
        <div class="teaser">
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Fira+Sans:400,600,700"
          ></link>
          <link
            rel="stylesheet"
            href="https://stijlgids.stad.gent/v6/css/styleguide.css"
          ></link>
          <link
            rel="stylesheet"
            href="https://stijlgids.stad.gent/v6/css/main.css"
          ></link>
          <link
            rel="stylesheet"
            href="https://stadgent.github.io/js_widget-besluiten/besluiten-detail/besluiten-detail.css"
          ></link>
          <div class="decision-detail">
            <div class="decision-detail__title">
              <a href={this.url} class="decision-detail__link">
                {this.decisionTitle}
              </a>
            </div>
            <dl class="decision-detail__list">
              <dt>Orgaan: </dt>
              <dd>{this.organ}</dd>
              {this.date && (
                <Fragment>
                  <dt>
                    {this.decisionType === "decision"
                      ? "Datum van de zitting: "
                      : "Datum van bekendmaking: "}
                  </dt>
                  <dd>{this.formatDate(this.date)}</dd>
                </Fragment>
              )}

              {this.type && (
                <Fragment>
                  <dt>Type: </dt>
                  <dd>{this.type}</dd>
                </Fragment>
              )}
            </dl>
            <span
              class={`decision-detail__status decision-detail__status--${this.statusGreen ? "true" : this.statusRed ? "false" : "void"}`}
            >
              {this.status || "Geen besluit"}
            </span>
          </div>
          <a
            href={this.url}
            class="teaser-overlay-link"
            tabindex="-1"
            aria-hidden="true"
          >
            {this.decisionTitle}
          </a>
        </div>
      );
    }
  }
}
