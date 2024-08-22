class SparkQLWidget extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const res = await this.executeQuery();
    console.log(res);
    this.innerHTML += this.render();
  }

  get mockData() {
    const mockdata = [];

    const res = [...Array(100)].map((_, i) => {
      mockdata.push({
        title: `Title ${i}`,
        description: `Beschrijving ${i}`,
        date: "Agustus 20",
        link: "https://google.be",
      });
    });

    return mockdata;
  }

  get sparkQLEndpoint() {
    const endpoint = this.getAttribute("sparql-endpoint");
    return endpoint && endpoint !== "" ? endpoint : "https://stad.gent/sparql";
  }

  get sparkQLQuery() {
    return this.getAttribute("sparkql-query");
  }

  async executeQuery() {
    const endpoint =
      this.sparkQLEndpoint + "?query=" + encodeURIComponent(this.sparkQLQuery);
    const response = await fetch(endpoint, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/sparql-results+json",
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.log("Error when getting data.");
      console.log(this.sparkQLQuery);
    }
  }

  render() {
    return /* HTML */ `
      <div class="sparql-widget-container">
        <span class="results-text"><b>Er zijn 182 resultaten</b></span>
        <ul class="filter__results">
          <article-preview
            tag="Varen"
            address="Groentenmarkt, 9000 Gent"
            title="Rederij De Genetenaer"
            imageUrl="https://i.imgur.com/YUx8S7q.png"
            description="Beste rederij in België 2018, Luxury Travel"
          />
          <article-preview
            tag="Varen; Boten; Hoi"
            address="Groentenmarkt, 9000 Gent"
            title="Rederij De Genetenaer"
            imageUrl="https://i.imgur.com/YUx8S7q.png"
            description="Beste rederij in België 2018, Luxury Travel"
          />
        </ul>
        <a class="sparql-data-btn" href="#">
          Bekijk de data via ons SPARQL-endpoint
        </a>
        <nav class="pager" aria-labelledby="pagination_1-55553">
          <h2 id="pagination_1-55553" class="visually-hidden">Pagination</h2>
          <ul class="pager__items">
            <li class="previous">
              <a href="#" class="standalone-link back">
                Vorige
                <span class="visually-hidden">pagina</span></a
              >
            </li>
            <li>
              <a href="#" title="Go to page 1"
                ><span class="visually-hidden">Pagina</span>
                1
              </a>
            </li>
            <li class="prev--number">
              <a href="#" title="Go to page 2"
                ><span class="visually-hidden">Pagina</span>
                2
              </a>
            </li>
            <li class="active">
              <span class="visually-hidden">Pagina</span>
              3
            </li>
            <li class="next--number">
              <a href="#" title="Go to page 4"
                ><span class="visually-hidden">Pagina</span>
                4
              </a>
            </li>
            <li class="spacing">...</li>
            <li>
              <a href="#" title="Go to page 5555"
                ><span class="visually-hidden">Pagina</span>
                5555
              </a>
            </li>
            <li class="next">
              <a href="#" class="standalone-link">
                Volgende
                <span class="visually-hidden">pagina</span></a
              >
            </li>
          </ul>
        </nav>
      </div>
    `;
  }

  formatDate(date) {
    date = new Date(date);
    let d = date.toLocaleDateString("nl-be", {
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    let t = date.toLocaleTimeString("nl-be", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
    return `${d} om ${t}`;
  }
}

customElements.define("sparkql-widget", SparkQLWidget);
