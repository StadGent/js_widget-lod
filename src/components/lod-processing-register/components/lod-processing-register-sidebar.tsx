import { Component, h, Fragment } from "@stencil/core";
import Modal from "@digipolis-gent/modal";
import "../../../assets/accordion.js";
import state, {
  toggleChecked,
  updateData,
  updateModalSearchFilter,
  updateSearchInput,
} from "../store.js";
import { capitalizeFirstLetter, toKebabCase } from "../../../utils/utils.js";
import { useTranslations } from "../../../i18n/utils.js";

const t = useTranslations("nl");

/**
 * @internal
 */
@Component({
  tag: "lod-processing-register-sidebar",
  shadow: false,
})
export class LodProcessingRegisterSideBar {
  componentDidUpdate() {
    if (
      state?.baseFacets !== undefined &&
      state.baseFacets?.length > 0 &&
      !state.modalsMade
    ) {
      const modals = document.querySelectorAll(
        ".modal:not(.has-custom-binding)",
      );

      const filterModal = document.querySelector("#modal-filter");
      new Modal(filterModal, {
        changeHash: false,
        resizeEvent: (_, close) => {
          if (window.innerWidth > 960) {
            close();
            filterModal.setAttribute("aria-hidden", "false");
          } else if (!filterModal.classList.contains("visible")) {
            filterModal.setAttribute("aria-hidden", "true");
          }
        },
      });

      modals?.forEach((modal) => new Modal(modal, { changeHash: false }));

      const accordions = document.querySelectorAll(".checkbox-accordion");
      accordions?.forEach((accordion) =>
        window.Accordion(accordion as HTMLElement),
      );
      state.modalsMade = true;

      document
        .querySelector("#lod-processing-register-name")
        .addEventListener("keydown", (event: any) => {
          if (event.key === "Enter") {
            event.preventDefault();
            updateData(true);
          }
        });
    }
  }

  isFacetChecked(facet: string, facetChild: string): boolean {
    return state.facetFilters
      .find((item) => item.name === facet)
      .facets?.find((child) => child.name === facetChild).checked;
  }

  render() {
    return (
      <>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            updateData(true);
          }}
          class="modal-inner"
          action="#result"
        >
          <div class="modal-header">
            <button
              class="button button-secondary close icon-cross modal-close"
              data-target="modal-filter"
              type="button"
            >
              <span>Sluit</span>
            </button>
          </div>
          <div class="modal-content">
            <h3 id="filter-title">Zoek verwerking</h3>
            <div class="form-item  stacked">
              <label htmlFor="lod-processing-register-name">Naam</label>

              <div class="form-columns">
                <div class="form-item-column">
                  <input
                    disabled={state.isUpdatingData}
                    type="text"
                    id="lod-processing-register-name"
                    class="text"
                    value={state.searchInput}
                    onInput={(event) => {
                      event.preventDefault();
                      updateSearchInput(event);
                    }}
                    style={{ marginBottom: ".5rem" }}
                  />

                  <button
                    type="button"
                    class="button button-secondary button-small icon-left icon-search lod-mobile-hidden"
                    disabled={state.isUpdatingData}
                    onClick={() => updateData(true)}
                  >
                    Zoek
                  </button>
                </div>
                <div class="form-item-column"></div>
              </div>
            </div>

            {state.baseFacets?.map((facet, index) => (
              <div key={facet.name}>
                {facet?.facets?.length <= 6 && (
                  <fieldset key={`filter-${facet.name}`} class="form-item ">
                    <legend>
                      <span class="legend-title">
                        {capitalizeFirstLetter(t(facet.name.toLowerCase()))}
                      </span>
                    </legend>
                    <div class="form-item">
                      <div class="form-columns">
                        <div class="form-item-column">
                          {facet.facets.map((facetChild) => (
                            <div class="checkbox">
                              <input
                                disabled={state.isUpdatingData}
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
                                  toggleChecked(facet.name, facetChild.name);
                                }}
                              />
                              <label
                                htmlFor={`input-${toKebabCase(facet.name)}-${toKebabCase(facetChild.name)}`}
                              >
                                {`${capitalizeFirstLetter(facetChild.name)} (${facetChild.count})`}
                              </label>
                            </div>
                          ))}
                        </div>

                        <div class="form-item-column"></div>
                      </div>
                    </div>
                  </fieldset>
                )}
                {facet?.facets?.length > 6 && facet?.facets?.length < 21 && (
                  <fieldset
                    key={`filter-${facet.name}`}
                    class="form-item  checkbox-filter-dynamic"
                  >
                    <legend>
                      <span class="legend-title">
                        {capitalizeFirstLetter(t(facet.name.toLowerCase()))}
                      </span>
                    </legend>

                    <div class="form-item">
                      <div class="form-columns">
                        <div class="form-item-column">
                          <div class="accordion-preview">
                            {facet.facets.slice(0, 3)?.map((facetChild) => (
                              <div class="checkbox">
                                <input
                                  disabled={state.isUpdatingData}
                                  type="checkbox"
                                  id={`input-${toKebabCase(facet.name)}-${toKebabCase(facetChild.name)}`}
                                  name="checkboxes-dynamic"
                                  class="checkbox"
                                  checked={this.isFacetChecked(
                                    facet.name,
                                    facetChild.name,
                                  )}
                                  onInput={() => {
                                    toggleChecked(facet.name, facetChild.name);
                                  }}
                                />
                                <label
                                  htmlFor={`input-${toKebabCase(facet.name)}-${toKebabCase(facetChild.name)}`}
                                >
                                  {capitalizeFirstLetter(
                                    t(facetChild.name).toLowerCase(),
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
                              {facet.facets.slice(3).map((facetChild) => (
                                <div class="checkbox">
                                  <input
                                    disabled={state.isUpdatingData}
                                    type="checkbox"
                                    id={`input-${toKebabCase(facet.name)}-${toKebabCase(facetChild.name)}`}
                                    name="checkboxes-dynamic"
                                    class="checkbox"
                                    checked={this.isFacetChecked(
                                      facet.name,
                                      facetChild.name,
                                    )}
                                    onInput={() => {
                                      toggleChecked(
                                        facet.name,
                                        facetChild.name,
                                      );
                                    }}
                                  />
                                  <label
                                    htmlFor={`input-${toKebabCase(facet.name)}-${toKebabCase(facetChild.name)}`}
                                  >
                                    {`${capitalizeFirstLetter(facetChild.name)} (${facetChild.count})`}
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
                        {capitalizeFirstLetter(t(facet.name.toLowerCase()))}
                      </span>
                    </legend>
                    <div class="form-item">
                      <div class="form-columns">
                        <div class="form-item-column">
                          <div class="modal-preview">
                            {facet.facets?.slice(0, 3)?.map((facetChild) => (
                              <div
                                key={`checkbox-${toKebabCase(facet.name)}-${toKebabCase(facetChild.name)}`}
                                class="checkbox preview"
                              >
                                <input
                                  disabled={state.isUpdatingData}
                                  type="checkbox"
                                  value={`${toKebabCase(facet.name)}-${toKebabCase(facetChild.name)}`}
                                  class="checkbox"
                                  checked={this.isFacetChecked(
                                    facet.name,
                                    facetChild.name,
                                  )}
                                  onInput={() => {
                                    toggleChecked(facet.name, facetChild.name);
                                  }}
                                  id={`input-${toKebabCase(facet.name)}-${toKebabCase(facetChild.name)}-preview`}
                                />

                                <label
                                  htmlFor={`input-${toKebabCase(facet.name)}-${toKebabCase(facetChild.name)}-preview`}
                                >
                                  {`${capitalizeFirstLetter(facetChild.name)} (${facetChild.count})`}
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
                                  type="button"
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
                                    disabled={state.isUpdatingData}
                                    type="search"
                                    id={`checkboxes__filter_id_${index}`}
                                    class="checkbox-filter__filter"
                                    aria-label="Filter the list below"
                                    value={state.modalFilters[facet.name]}
                                    onInput={(event) =>
                                      updateModalSearchFilter(event, facet.name)
                                    }
                                  />

                                  <div
                                    aria-live="polite"
                                    aria-atomic="true"
                                    class="checkbox-filter__result-wrapper"
                                  >
                                    <span class="checkbox-filter__result">
                                      {
                                        facet.facets.filter((facetChild) =>
                                          facetChild.name
                                            .toLowerCase()
                                            .includes(
                                              state.modalFilters[facet.name],
                                            ),
                                        ).length
                                      }
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
                                        t(facet.name.toLowerCase()),
                                      ) || "No filter name"}
                                    </span>
                                  </legend>
                                  <div class="form-item">
                                    <div class="form-columns">
                                      <div class="form-item-column">
                                        {facet.facets
                                          .filter((facetChild) =>
                                            facetChild.name
                                              .toLowerCase()
                                              .includes(
                                                state.modalFilters[facet.name],
                                              ),
                                          )
                                          .map((facetChild) => (
                                            <div
                                              key={`checkbox-modal-${toKebabCase(facet.name)}-${toKebabCase(facetChild.name)}`}
                                              class="checkbox"
                                            >
                                              <input
                                                disabled={state.isUpdatingData}
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
                                                  toggleChecked(
                                                    facet.name,
                                                    facetChild.name,
                                                  );
                                                }}
                                              />
                                              <label
                                                htmlFor={`input-${toKebabCase(facet.name)}-${toKebabCase(facetChild.name)}`}
                                              >
                                                {`${facetChild.name} (${facetChild.count})`}
                                              </label>
                                            </div>
                                          ))}
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
              </div>
            ))}
          </div>
          <div class="hidden-desktop">
            <div class="modal-actions ">
              <button
                data-target="modal-filter"
                type="button"
                class="button button-primary filter__submit modal-close"
                onClick={() => updateData(true)}
              >
                Zoek
              </button>
            </div>
          </div>
        </form>

        <div
          class="modal-overlay modal-close"
          data-target="modal-filter"
          tabindex="-1"
        ></div>
      </>
    );
  }
}
