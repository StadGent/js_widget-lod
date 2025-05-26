import { Component, h, State, Fragment, Watch } from "@stencil/core";
import Modal from "@digipolis-gent/modal";
import "../../assets/accordion.js";

interface Facet {
  name: string;
  facets: Facet[];
}

interface FacetFilter {
  name: string;
  facets: { name: string; checked: boolean }[];
}

interface FacetData {
  id: string;
  processor: string;
  type: string;
  name: string;
  formal_framework: string;
  audience: string;
}

interface QueryData {
  total_count: number;
  results: FacetData[];
}

declare global {
  interface Window {
    Accordion: (elem: HTMLElement, options?: any) => any;
  }
}

function toKebabCase(input: string): string {
  return input
    .toLowerCase() // Step 1: Lowercase
    .replace(/[^a-z0-9\s]/g, "") // Step 2: Remove special characters (except space)
    .trim() // Step 3: Trim leading/trailing spaces
    .replace(/\s+/g, "-"); // Step 4: Replace spaces with hyphens
}

function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

@Component({
  tag: "lod-processing-register",
  shadow: false,
})
export class LodProcessingRegister {
  @State() baseFacets: Facet[];
  @State() queryData: QueryData;
  @State() facetFilters: FacetFilter[] = [];
  @State() modalsMade: boolean = false;
  @State() checkedFacets: FacetFilter[];
  @State() disjunctiveFacets: FacetFilter[];

  @Watch("facetFilters")
  facetFilterHandler(updatedFacets: FacetFilter[]) {
    this.checkedFacets = updatedFacets.map((facet) => ({
      name: facet.name,
      facets: facet.facets.filter((child) => child.checked === true),
    }));
  }

  @Watch("checkedFacets")
  checkedFacetsHandler(updatedFacets: FacetFilter[]) {
    this.disjunctiveFacets = updatedFacets.filter(
      (facet) => facet.facets.length > 0,
    );
  }

  async componentWillLoad() {
    this.getInitialData();
    this.getBaseFacets();
  }

  getInitialData = async () => {
    const baseUrl =
      "https://data.stad.gent/api/explore/v2.1/catalog/datasets/verwerkingsregister-stad-gent/records?limit=10&apikey=c5e39099e6c0c9d23041ef66b64cf82df92f31f27291836b97d57204";
    const response = await fetch(baseUrl);
    this.queryData = await response.json();
  };

  updateData = async () => {
    const params = new URLSearchParams();

    // Add complex facet (with nested name and disjunctive)

    this.disjunctiveFacets.forEach((facet) =>
      params.append("facet", `facet(name="${facet.name}",disjunctive=true)`),
    );

    // Add additional facet parameters
    const additionalFacets = this.checkedFacets.filter(
      (facet) => !(facet.facets.length > 0),
    );
    additionalFacets.forEach((facet) => {
      params.append("facet", facet.name);
    });

    this.disjunctiveFacets.forEach((facet) =>
      facet.facets.forEach((childFacet) =>
        params.append("refine", `${facet.name}:${childFacet.name}`),
      ),
    );

    // Add refine filters for processors

    const baseUrl =
      "https://data.stad.gent/api/explore/v2.1/catalog/datasets/verwerkingsregister-stad-gent/records";

    // Add API key
    params.set(
      "apikey",
      "c5e39099e6c0c9d23041ef66b64cf82df92f31f27291836b97d57204",
    );

    const url = `${baseUrl}?${params.toString()}`;

    const response = await fetch(url);
    this.queryData = await response.json();
  };

  getBaseFacets = async () => {
    const baseFacets =
      "https://data.stad.gent/api/explore/v2.1/catalog/datasets/verwerkingsregister-stad-gent/facets?facet=processor&facet=personaldata&facet=grantees&facet=type&facet=formal_framework&facet=audience&apikey=c5e39099e6c0c9d23041ef66b64cf82df92f31f27291836b97d57204";
    const response = await fetch(baseFacets);
    const data = await response.json();
    this.baseFacets = data.facets.map((facetGroup) => ({
      ...facetGroup,
      facets: facetGroup.facets.filter((f) => f.name !== ""),
    }));

    this.facetFilters = data.facets.map((facet) => ({
      name: facet.name,
      facets: facet.facets.map((facet) => ({
        name: facet.name,
        checked: false,
      })),
    }));
  };

  deleteAllFilters = () => {
    this.facetFilters = this.facetFilters.map((facet) => ({
      name: facet.name,
      facets: facet.facets.map((facet) => ({
        name: facet.name,
        checked: false,
      })),
    }));
  };

  componentDidUpdate() {
    if (this.baseFacets?.length > 0 && !this.modalsMade) {
      const modals = document.querySelectorAll(
        ".modal:not(.has-custom-binding)",
      );

      modals?.forEach((modal) => new Modal(modal));

      const accordions = document.querySelectorAll(".checkbox-accordion");
      accordions?.forEach((accordion) =>
        window.Accordion(accordion as HTMLElement),
      );
      this.modalsMade = true;
    }
  }

  isFacetChecked(facet: string, facetChild: string): boolean {
    return this.facetFilters
      .find((item) => item.name === facet)
      .facets?.find((child) => child.name === facetChild).checked;
  }

  toggleChecked(facet: string, facetChild: string) {
    this.facetFilters = this.facetFilters.map((item) => {
      if (item.name !== facet) return item;

      return {
        ...item,
        facets: item.facets?.map((child) =>
          child.name === facetChild
            ? { ...child, checked: !child.checked }
            : child,
        ),
      };
    });
  }

  render() {
    return (
      <>
        <div>
          <main class="filter-page">
            {/* <div class="highlight sidebar-layout">
            <div class="highlight__inner">
              <div>
                <p>
                  De Algemene Verordening Gegevensbescherming verplicht ons een
                  intern register bij te houden met al onze verwerkingen van
                  persoonsgegevens.
                </p>{" "}
                <p>
                  De Stad en OCMW Gent vinden de bescherming van jouw
                  persoonsgegevens erg belangrijk.
                </p>{" "}
                <p>
                  Daarom vind je op deze pagina een overzicht van de
                  verwerkingen van de persoonsgegevens die we uitvoeren.
                </p>{" "}
                <p>
                  Dit overzicht is een samenvatting van ons intern register dat
                  regelmatig wordt bijgewerkt.
                </p>{" "}
                <p>
                  Heb je een vraag over dit register of denk je dat er een
                  verwerking ontbreekt, neem dan contact op met de functionaris
                  van gegevensbescherming (DPO) via het{" "}
                  <a href="https://formulieren.stad.gent/productie4.2/formulier/nl-NL/DefaultEnvironment/scprivacystad.aspx">
                    contactformulier
                  </a>{" "}
                  of <a href="mailto:privacy@stad.gent">privacy@stad.gent</a>.
                </p>{" "}
                <p>
                  Wens je meer informatie over hoe we met jouw persoonsgegevens
                  omgaan?
                </p>{" "}
                <p>
                  Lees dan de{" "}
                  <a href="https://stad.gent/over-gent-en-het-stadsbestuur/vragen-suggesties-en-meldingen/met-respect-voor-uw-privacy">
                    privacyverklaring op onze website
                  </a>
                  .
                </p>
              </div>
            </div>
          </div> */}
            <div class="sidebar-layout filter">
              <div
                id="filter"
                class="modal sidebar filter-section modal--fixed-height"
                role="dialog"
                aria-modal="true"
                aria-labelledby="filter-title"
                tabindex="-1"
              >
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    this.updateData();
                  }}
                  class="modal-inner"
                  action="#result"
                >
                  <div class="modal-header">
                    <button
                      class="button button-secondary close icon-cross modal-close"
                      data-target="filter"
                    >
                      <span>Sluit</span>
                    </button>
                  </div>
                  <div class="modal-content">
                    <h3 id="filter-title">Zoek verwerking</h3>
                    <div class="form-item  stacked">
                      <label htmlFor="default-name_id">Naam</label>

                      <div class="form-columns">
                        <div class="form-item-column">
                          <input
                            type="text"
                            id="default-name_id"
                            name="default-name_name"
                            class="text"
                          />
                        </div>
                        <div class="form-item-column"></div>
                      </div>
                    </div>

                    {this.baseFacets?.map((facet, index) => (
                      <>
                        {facet?.facets?.length <= 6 && (
                          <fieldset
                            key={`filter-${facet.name}`}
                            class="form-item "
                          >
                            <legend>
                              <span class="legend-title">
                                {capitalizeFirstLetter(facet.name)}
                              </span>
                            </legend>
                            <div class="form-item">
                              <div class="form-columns">
                                <div class="form-item-column">
                                  {facet.facets.map((childFacet) => (
                                    <div class="checkbox">
                                      <input
                                        type="checkbox"
                                        id={`input-${toKebabCase(facet.name)}-${toKebabCase(childFacet.name)}`}
                                        name="checkboxes-dynamic"
                                        value={`${toKebabCase(facet.name)}-${toKebabCase(childFacet.name)}`}
                                        class="checkbox"
                                      />
                                      <label
                                        htmlFor={`input-${toKebabCase(facet.name)}-${toKebabCase(childFacet.name)}`}
                                      >
                                        {capitalizeFirstLetter(childFacet.name)}
                                      </label>
                                    </div>
                                  ))}
                                </div>

                                <div class="form-item-column"></div>
                              </div>
                            </div>
                          </fieldset>
                        )}
                        {facet?.facets?.length > 6 &&
                          facet?.facets?.length < 21 && (
                            <fieldset
                              key={`filter-${facet.name}`}
                              class="form-item  checkbox-filter-dynamic"
                            >
                              <legend>
                                <span class="legend-title">
                                  {capitalizeFirstLetter(facet.name)}
                                </span>
                              </legend>

                              <div class="form-item">
                                <div class="form-columns">
                                  <div class="form-item-column">
                                    <div class="accordion-preview">
                                      {facet.facets
                                        .slice(0, 3)
                                        ?.map((facetChild) => (
                                          <div class="checkbox">
                                            <input
                                              type="checkbox"
                                              id={`input-${toKebabCase(facet.name)}-${toKebabCase(facetChild.name)}`}
                                              name="checkboxes-dynamic"
                                              class="checkbox"
                                            />
                                            <label
                                              htmlFor={`input-${toKebabCase(facet.name)}-${toKebabCase(facetChild.name)}`}
                                            >
                                              {capitalizeFirstLetter(
                                                facetChild.name,
                                              )}
                                            </label>
                                          </div>
                                        ))}
                                    </div>

                                    <div class="checkbox-accordion">
                                      <div
                                        class="accordion--content"
                                        aria-hidden="true"
                                        hidden={true}
                                        id={`hidden-options-more-than-6-${index}`}
                                      >
                                        {facet.facets
                                          .slice(3)
                                          .map((facetChild) => (
                                            <div class="checkbox">
                                              <input
                                                type="checkbox"
                                                id={`input-${toKebabCase(facet.name)}-${toKebabCase(facetChild.name)}`}
                                                name="checkboxes-dynamic"
                                                class="checkbox"
                                              />
                                              <label
                                                htmlFor={`input-${toKebabCase(facet.name)}-${toKebabCase(facetChild.name)}`}
                                              >
                                                {facetChild.name}
                                              </label>
                                            </div>
                                          ))}
                                      </div>

                                      <button
                                        type="button"
                                        class="accordion--button button button-secondary button-small icon-left"
                                        aria-expanded="false"
                                        aria-controls={`hidden-options-more-than-6-${index}`}
                                      >
                                        Toon meer
                                      </button>
                                    </div>
                                  </div>

                                  <div class="form-item-column"></div>
                                </div>
                              </div>
                            </fieldset>
                          )}
                        {facet?.facets?.length >= 21 && (
                          <fieldset
                            key={`filter-${toKebabCase(facet.name)}`}
                            class="form-item  checkbox-filter-dynamic"
                          >
                            <legend>
                              <span class="legend-title">
                                {capitalizeFirstLetter(facet.name)}
                              </span>
                            </legend>

                            <div class="form-item">
                              <div class="form-columns">
                                <div class="form-item-column">
                                  <div class="modal-preview">
                                    {facet.facets
                                      ?.slice(0, 3)
                                      ?.map((facetChild) => (
                                        <div
                                          key={`checkbox-${toKebabCase(facet.name)}-${toKebabCase(facetChild.name)}`}
                                          class="checkbox preview"
                                        >
                                          <input
                                            type="checkbox"
                                            value={`${toKebabCase(facet.name)}-${toKebabCase(facetChild.name)}`}
                                            class="checkbox"
                                            checked={this.isFacetChecked(
                                              facet.name,
                                              facetChild.name,
                                            )}
                                            onInput={() => {
                                              this.toggleChecked(
                                                facet.name,
                                                facetChild.name,
                                              );
                                            }}
                                            id={`input-${toKebabCase(facet.name)}-${toKebabCase(facetChild.name)}-preview`}
                                          />

                                          <label
                                            htmlFor={`input-${toKebabCase(facet.name)}-${toKebabCase(facetChild.name)}-preview`}
                                          >
                                            {facetChild.name ||
                                              "No filter name"}
                                          </label>
                                        </div>
                                      ))}
                                  </div>

                                  <div
                                    id={`modal-${index}`}
                                    class="modal modal--fixed-height checkbox-filter__modal"
                                    role="dialog"
                                    aria-modal="true"
                                    aria-labelledby={`modal-${index}-title`}
                                    tabindex="-1"
                                  >
                                    <div class="modal-inner">
                                      <div class="modal-header">
                                        <button
                                          class="button button-secondary close icon-cross modal-close checkbox-filter__close"
                                          data-target={`modal-${index}`}
                                        >
                                          <span>Sluit</span>
                                        </button>
                                      </div>
                                      <div class="modal-content">
                                        <h2 id={`modal-${index}-title`}>
                                          {capitalizeFirstLetter(facet.name) ||
                                            "No filter name"}
                                        </h2>

                                        <div class="form-item checkbox-filter__filter__search-wrapper">
                                          <input
                                            type="search"
                                            id={`checkboxes__filter_id_${index}`}
                                            class="checkbox-filter__filter"
                                            aria-label="Filter the list below"
                                          />

                                          <div
                                            aria-live="polite"
                                            aria-atomic="true"
                                            class="checkbox-filter__result-wrapper"
                                          >
                                            <span class="checkbox-filter__result">
                                              {facet.facets.length}
                                            </span>{" "}
                                            filter(s) gevonden
                                          </div>
                                        </div>

                                        <div class="tag-list-wrapper">
                                          <ul class="tag-list checkbox-filter__selected"></ul>
                                        </div>

                                        <fieldset class="form-item">
                                          <legend>
                                            <span class="legend-title">
                                              {capitalizeFirstLetter(
                                                facet.name,
                                              ) || "No filter name"}
                                            </span>
                                          </legend>
                                          <div class="form-item">
                                            <div class="form-columns">
                                              <div class="form-item-column">
                                                {facet.facets.map(
                                                  (facetChild) => (
                                                    <div
                                                      key={`checkbox-modal-${toKebabCase(facet.name)}-${toKebabCase(facetChild.name)}`}
                                                      class="checkbox"
                                                    >
                                                      <input
                                                        type="checkbox"
                                                        id={`input-${toKebabCase(facet.name)}-${toKebabCase(facetChild.name)}`}
                                                        name="checkboxes-dynamic"
                                                        value={`${toKebabCase(facet.name)}-${toKebabCase(facetChild.name)}`}
                                                        class="checkbox"
                                                        checked={this.isFacetChecked(
                                                          facet.name,
                                                          facetChild.name,
                                                        )}
                                                        onInput={() => {
                                                          this.toggleChecked(
                                                            facet.name,
                                                            facetChild.name,
                                                          );
                                                        }}
                                                      />
                                                      <label
                                                        htmlFor={`input-${toKebabCase(facet.name)}-${toKebabCase(facetChild.name)}`}
                                                      >
                                                        {facetChild.name}
                                                      </label>
                                                    </div>
                                                  ),
                                                )}
                                              </div>

                                              <div class="form-item-column"></div>
                                            </div>
                                          </div>
                                        </fieldset>
                                      </div>
                                      <div class="modal-actions">
                                        <button
                                          type="button"
                                          class="button button-primary checkbox-filter__submit modal-close"
                                          data-target={`modal-${index}`}
                                        >
                                          Bevestig selectie
                                        </button>
                                      </div>
                                    </div>

                                    <div
                                      class="modal-overlay modal-close checkbox-filter__close"
                                      data-target={`modal-${index}`}
                                      tabindex="-1"
                                    ></div>
                                  </div>

                                  <button
                                    type="button"
                                    class="button button-secondary button-small icon-left icon-search checkbox-filter__open"
                                    aria-controls={`modal-${index}`}
                                    aria-expanded="false"
                                  >
                                    Toon meer
                                  </button>
                                </div>

                                <div class="form-item-column"></div>
                              </div>
                            </div>
                          </fieldset>
                        )}
                      </>
                    ))}
                  </div>
                  <div class="modal-actions">
                    <button
                      type="submit"
                      class="button button-primary filter__submit"
                    >
                      Zoek
                    </button>
                  </div>
                </form>

                <div
                  class="modal-overlay modal-close"
                  data-target="filter"
                  tabindex="-1"
                ></div>
              </div>

              <section class="content result-section" id="result">
                {this.disjunctiveFacets &&
                  this.disjunctiveFacets.length > 0 && (
                    <div class="selected-filters">
                      <div class="filter-page-label">Je filterde op:</div>
                      <div class="tag-list-wrapper">
                        <ul class="tag-list">
                          {this.disjunctiveFacets?.map((facet) => (
                            <>
                              {facet.facets.map((facet) => (
                                <li>
                                  <span class="tag filter ">
                                    {facet.name}
                                    <button>
                                      <span class="visually-hidden">
                                        Verwijder filter {facet.name}
                                      </span>
                                    </button>
                                  </span>
                                </li>
                              ))}
                            </>
                          ))}

                          <li>
                            <a onClick={this.deleteAllFilters} href="#">
                              Verwijder alle filters{" "}
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                <div class="filter__result-count">
                  <div class="filter-page-label">
                    We vonden {this.queryData?.total_count} resultaten
                  </div>
                  <button
                    type="button"
                    class="button button-secondary icon-filter result__show-filters modal-trigger"
                    aria-expanded="false"
                    aria-controls="filter"
                  >
                    Filters
                  </button>
                </div>

                <ul class="filter__results">
                  {this?.queryData?.results?.map((item) => (
                    <li key={`result-${item.name}`} class="teaser teaser--wide">
                      <article class="teaser-content">
                        <div class="content__second">
                          <h3 class="h4">{item.name}</h3>

                          <dl>
                            {item?.type && item?.type.length > 0 && (
                              <div>
                                <dt>Categorie</dt> <dd>{item.type}</dd>
                              </div>
                            )}

                            {item?.processor && item?.processor.length > 0 && (
                              <div>
                                <dt>Verwerkende dienst</dt>{" "}
                                <dd>{item.processor}</dd>
                              </div>
                            )}
                            {item?.formal_framework &&
                              item?.formal_framework.length > 0 && (
                                <div>
                                  <dt>Rechtmatigheid</dt>{" "}
                                  <dd>{item.formal_framework}</dd>
                                </div>
                              )}
                          </dl>

                          <a href="#" class="read-more standalone-link">
                            Lees meer{" "}
                            <span class="visually-hidden">
                              over {item.name}
                            </span>
                          </a>
                        </div>
                      </article>
                      <a
                        href="#"
                        class="teaser-overlay-link"
                        tabindex="-1"
                        aria-hidden="true"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>

                <nav class="pager" aria-labelledby="pagination_1-2017">
                  <h2 id="pagination_1-2017" class="visually-hidden">
                    Pagination
                  </h2>
                  <ul class="pager__items">
                    <li class="previous">
                      <a href="#" class="standalone-link back">
                        Previous
                        <span class="visually-hidden">page</span>
                      </a>
                    </li>
                    <li>
                      <a href="#" title="Go to page 1">
                        <span class="visually-hidden">Page</span>1
                      </a>
                    </li>
                    <li class="spacing">...</li>
                    <li class="prev--number">
                      <a href="#" title="Go to page 16">
                        <span class="visually-hidden">Page</span>
                        16
                      </a>
                    </li>
                    <li class="active">
                      <span class="visually-hidden">Page</span>
                      17
                    </li>
                    <li class="next--number">
                      <a href="#" title="Go to page 18">
                        <span class="visually-hidden">Page</span>
                        18
                      </a>
                    </li>
                    <li class="spacing">...</li>
                    <li>
                      <a href="#" title="Go to page 20">
                        <span class="visually-hidden">Page</span>
                        20
                      </a>
                    </li>
                    <li class="next">
                      <a href="#" class="standalone-link">
                        Next
                        <span class="visually-hidden">page</span>
                      </a>
                    </li>
                  </ul>
                </nav>
              </section>
            </div>
          </main>
        </div>
      </>
    );
  }
}
