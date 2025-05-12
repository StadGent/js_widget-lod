import { Component, h, Fragment } from "@stencil/core";
import Modal from "@digipolis-gent/modal";
import "../../assets/accordion.js";
import state, { toggleChecked, updateData } from "./store";
import { capitalizeFirstLetter, toKebabCase } from "../../utils/utils.js";

@Component({
  tag: "lod-sidebar",
  shadow: false,
})
export class LodSideBar {
  componentDidUpdate() {
    if (state.baseFacets?.length > 0 && !state.modalsMade) {
      const modals = document.querySelectorAll(
        ".modal:not(.has-custom-binding)",
      );

      modals?.forEach((modal) => new Modal(modal));

      const accordions = document.querySelectorAll(".checkbox-accordion");
      accordions?.forEach((accordion) =>
        window.Accordion(accordion as HTMLElement),
      );
      state.modalsMade = true;
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

            {state.baseFacets?.map((facet, index) => (
              <>
                {facet?.facets?.length <= 6 && (
                  <fieldset key={`filter-${facet.name}`} class="form-item ">
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
                {facet?.facets?.length > 6 && facet?.facets?.length < 21 && (
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
                            {facet.facets.slice(0, 3)?.map((facetChild) => (
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
                                  {capitalizeFirstLetter(facetChild.name)}
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
                            {facet.facets?.slice(0, 3)?.map((facetChild) => (
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
                                    toggleChecked(facet.name, facetChild.name);
                                  }}
                                  id={`input-${toKebabCase(facet.name)}-${toKebabCase(facetChild.name)}-preview`}
                                />

                                <label
                                  htmlFor={`input-${toKebabCase(facet.name)}-${toKebabCase(facetChild.name)}-preview`}
                                >
                                  {facetChild.name || "No filter name"}
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
                                      {capitalizeFirstLetter(facet.name) ||
                                        "No filter name"}
                                    </span>
                                  </legend>
                                  <div class="form-item">
                                    <div class="form-columns">
                                      <div class="form-item-column">
                                        {facet.facets.map((facetChild) => (
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
                                                toggleChecked(
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
              </>
            ))}
          </div>
          <div class="modal-actions">
            <button type="submit" class="button button-primary filter__submit">
              Zoek
            </button>
          </div>
        </form>

        <div
          class="modal-overlay modal-close"
          data-target="filter"
          tabindex="-1"
        ></div>
      </>
    );
  }
}
