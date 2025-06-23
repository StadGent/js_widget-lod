import { Component, h } from "@stencil/core";
import state from "./store";

@Component({
  tag: "lod-processing-register-results",
  shadow: false,
})
export class LodProcessingRegisterResults {
  render() {
    return (
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
                      <dt>Verwerkende dienst</dt>
                      <dd>{item.processor}</dd>
                    </div>
                  )}
                  {item?.formal_framework &&
                    item?.formal_framework.length > 0 && (
                      <div>
                        <dt>Rechtmatigheid</dt>
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
    );
  }
}
