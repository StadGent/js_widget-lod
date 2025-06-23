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
  styleUrl: "lod-processing-register.scss",
})
export class LodProcessingRegister {
  async componentWillLoad() {
    this.getInitialData();
    setBaseFacets();

    setTimeout(() => {
      state.initialAnimationFinished = true;
    }, 250);
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
          <div class="sidebar-layout filter">
            {(!state.modalsMade || !state.initialAnimationFinished) && (
              <lod-processing-register-sidebar-skeleton class="sidebar mobile-hidden filter-section modal--fixed-height " />
            )}

            <lod-processing-register-sidebar
              id="modal-filter"
              class={`modal sidebar filter-section modal--fixed-height has-custom-binding ${!state.modalsMade || !state.initialAnimationFinished ? "lod-hidden" : ""}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="filter-title"
              tabindex="-1"
            />

            <section
              class={`content result-section ${!state.modalsMade || !state.initialAnimationFinished ? "full-width-mobile" : ""}`}
              id="result"
            >
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
                              <button type="button">
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
                                <button type="button">
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
                  id="modal-filter-button"
                  aria-controls="modal-filter"
                  aria-expanded="false"
                >
                  Filters
                </button>
              </div>

              {!state.queryData || !state.initialAnimationFinished ? (
                <lod-processing-register-result-skeleton class="skeleton-container filter__results" />
              ) : (
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
              )}

              <lod-paginator />
            </section>
          </div>
        </div>
      </>
    );
  }
}
