import { Component, h, Fragment } from "@stencil/core";
import state, { setBaseFacets, toggleChecked } from "./store";
import { updateData } from "./store";
import { getPersonalDataProcessingList } from "../../services/queries";

declare global {
  interface Window {
    Accordion: (elem: HTMLElement, options?: any) => any;
  }
}

@Component({
  tag: "lod-processing-register",
  shadow: false,
})
export class LodProcessingRegister {
  async componentWillLoad() {
    this.getInitialData();
    setBaseFacets();
  }

  getInitialData = async () => {
    const params = new URLSearchParams(window.location.search);

    let offsetString = params.get("offset");
    let page = 1;

    if (offsetString && offsetString.length > 0) {
      const nameFilter = params
        .get("where")
        ?.match(/name\s+like\s+'%(.+)%'/)?.[1];
      if (nameFilter && nameFilter.length > 0) {
        state.searchInput = nameFilter;
        state.searchInputFiltered = nameFilter;
      }
      page = Number(offsetString) / 10 + 1;
      state.queryData = await getPersonalDataProcessingList(
        window.location.search,
      );
    } else {
      state.queryData = await getPersonalDataProcessingList((page - 1) * 10);
    }

    state.totalPages = Math.ceil(state.queryData.total_count / 10);
    state.currentPage = page;
  };

  deleteAllFilters = () => {
    state.searchInput = "";
    state.searchInputFiltered = "";
    state.currentPage = 1;
    state.facetFilters = state.facetFilters.map((facet) => ({
      name: facet.name,
      facets: facet.facets.map((facet) => ({
        name: facet.name,
        count: facet.count,
        checked: false,
      })),
    }));
    updateData(true);
  };

  render() {
    return (
      <>
        <div id="lod-processing-register" class="filter-page">
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
            <lod-sidebar
              id="filter"
              class="modal sidebar filter-section modal--fixed-height"
              role="dialog"
              aria-modal="true"
              aria-labelledby="filter-title"
              tabindex="-1"
            />
            <section class="content result-section" id="result">
              {((state.appliedFilters && state.appliedFilters.length > 0) ||
                (state.searchInputFiltered &&
                  state.searchInputFiltered.trim().length > 0)) && (
                <div class="selected-filters">
                  <div class="filter-page-label">Je filterde op:</div>
                  <div class="tag-list-wrapper">
                    <ul class="tag-list">
                      {state.searchInputFiltered &&
                        state.searchInputFiltered.trim().length > 0 && (
                          <li
                            onClick={() => {
                              state.searchInputFiltered = "";
                              state.searchInput = "";
                              updateData();
                            }}
                          >
                            <span class="tag filter ">
                              {state.searchInputFiltered}
                              <button>
                                <span class="visually-hidden">
                                  Verwijder filter {state.searchInputFiltered}
                                </span>
                              </button>
                            </span>
                          </li>
                        )}
                      {state.disjunctiveFacets?.map((facet) => (
                        <>
                          {facet.facets.map((facetChild) => (
                            <li
                              onClick={() => {
                                toggleChecked(facet.name, facetChild.name);
                                updateData();
                              }}
                            >
                              <span class="tag filter ">
                                {facetChild.name}
                                <button>
                                  <span class="visually-hidden">
                                    Verwijder filter {facetChild.name}
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
                  We vonden {state.queryData?.total_count} resultaten
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
                {state?.queryData?.results?.map((item) => (
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
                          <span class="visually-hidden">over {item.name}</span>
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
              <lod-paginator />
            </section>
          </div>
        </div>
      </>
    );
  }
}
