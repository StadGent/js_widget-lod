import { Component, h, Fragment } from "@stencil/core";
import state, { updatePage } from "./store";

@Component({
  tag: "lod-paginator",
  shadow: false,
})
export class LodPaginator {
  private blur(e: Event) {
    (e.target as HTMLElement).blur();
  }

  render() {
    return (
      <nav class="pager" aria-labelledby="pagination_1-2017">
        <h2 id="pagination_1-2017" class="visually-hidden">
          Pagination
        </h2>
        <ul class="pager__items">
          {/* Previous */}
          {state.currentPage !== 1 && (
            <li class="previous">
              <a
                href="#result"
                class="previous"
                onClick={(e) => {
                  e.preventDefault();
                  this.blur(e);
                  updatePage(state.currentPage - 1);
                }}
              >
                Vorige
                <span class="visually-hidden">pagina</span>
              </a>
            </li>
          )}

          {/* Page 1 */}
          <li class={state.currentPage === 1 ? "active" : ""}>
            <a
              href="#result"
              title={`Ga naar pagina 1`}
              onClick={(e) => {
                e.preventDefault();
                this.blur(e);
                updatePage(1);
              }}
            >
              <span class="visually-hidden">Pagina</span>
              {1}
            </a>
          </li>

          {/* Ellipsis before */}
          {state.currentPage > 3 && <li>...</li>}

          {/* Previous page (if not 1 or total) */}
          {state.currentPage - 1 > 1 &&
            state.currentPage - 1 !== state.totalPages && (
              <li>
                <a
                  href="#result"
                  title={`Ga naar pagina ${state.currentPage - 1}`}
                  onClick={(e) => {
                    e.preventDefault();
                    this.blur(e);
                    updatePage(state.currentPage - 1);
                  }}
                >
                  <span class="visually-hidden">Pagina</span>
                  {state.currentPage - 1}
                </a>
              </li>
            )}

          {/* Current page (if not 1 or total) */}
          {state.currentPage !== 1 &&
            state.currentPage !== state.totalPages && (
              <li class="active">
                <a
                  href="#result"
                  title={`Ga naar pagina ${state.currentPage}`}
                  onClick={(e) => {
                    e.preventDefault();
                    this.blur(e);
                    updatePage(state.currentPage);
                  }}
                >
                  <span class="visually-hidden">Pagina</span>
                  {state.currentPage}
                </a>
              </li>
            )}

          {/* Next page (if not last or second to last) */}
          {state.currentPage + 1 < state.totalPages && (
            <li>
              <a
                href="#result"
                title={`Ga naar pagina ${state.currentPage + 1}`}
                onClick={(e) => {
                  e.preventDefault();
                  this.blur(e);
                  updatePage(state.currentPage + 1);
                }}
              >
                <span class="visually-hidden">Pagina</span>
                {state.currentPage + 1}
              </a>
            </li>
          )}

          {/* Ellipsis after */}
          {state.totalPages - state.currentPage > 2 && <li>...</li>}

          {/* Last page */}
          {state.totalPages > 1 && (
            <li class={state.currentPage === state.totalPages ? "active" : ""}>
              <a
                href="#result"
                title={`Ga naar pagina ${state.totalPages}`}
                onClick={(e) => {
                  e.preventDefault();
                  this.blur(e);
                  updatePage(state.totalPages);
                }}
              >
                <span class="visually-hidden">Pagina</span>
                {state.totalPages}
              </a>
            </li>
          )}

          {/* Next */}
          {state.currentPage !== state.totalPages && (
            <li class="next">
              <a
                href="#result"
                class="next"
                onClick={(e) => {
                  e.preventDefault();
                  this.blur(e);
                  updatePage(state.currentPage + 1);
                }}
              >
                Volgende
                <span class="visually-hidden">pagina</span>
              </a>
            </li>
          )}
        </ul>
      </nav>
    );
  }
}
