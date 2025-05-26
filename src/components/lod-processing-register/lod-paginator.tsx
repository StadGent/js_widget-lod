import { Component, h, Fragment } from "@stencil/core";
import state, { updatePage } from "./store";

@Component({
  tag: "lod-paginator",
  shadow: false,
})
export class LodPaginator {
  render() {
    return (
      <nav class="pager" aria-labelledby="pagination_1-2017">
        <h2 id="pagination_1-2017" class="visually-hidden">
          Pagination
        </h2>
        <ul class="pager__items">
          {state.currentPage !== 1 && (
            <li
              onClick={() => {
                updatePage(state.currentPage - 1);
              }}
              class="previous"
            >
              <a href="javascript:;" class="standalone-link back">
                Vorige
                <span class="visually-hidden">pagina</span>
              </a>
            </li>
          )}
          <li
            onClick={() => {
              updatePage(1);
            }}
            class={state.currentPage === 1 ? "active" : ""}
          >
            <a href="javascript:;" title="Go to page 1">
              <span class="visually-hidden">Page</span>1
            </a>
          </li>
          {state.currentPage < 4 && state.totalPages > 2 && (
            <>
              {[...Array(3)].map((_, i) => (
                <li
                  onClick={() => {
                    updatePage(i + 2);
                  }}
                  class={state.currentPage === i + 2 ? "active" : ""}
                >
                  <a href="javascript:;" title={`Ga naar pagina ${i + 2}`}>
                    <span class="visually-hidden">Page</span>
                    {i + 2}
                  </a>
                </li>
              ))}
            </>
          )}
          {state.currentPage >= 4 &&
            state.currentPage < state.totalPages - 2 && (
              <>
                <li class="spacing">...</li>
                <li
                  onClick={() => {
                    updatePage(state.currentPage - 1);
                  }}
                  class="prev--number"
                >
                  <a href="javascript:;" title="Go to page 1">
                    <span class="visually-hidden">Page</span>
                    {state.currentPage - 1}
                  </a>
                </li>
                <li class="active">
                  <a href="javascript:;" title="Go to page 1">
                    <span class="visually-hidden">Page</span>
                    {state.currentPage}
                  </a>
                </li>
                <li
                  onClick={() => {
                    updatePage(state.currentPage + 1);
                  }}
                  class="next--number"
                >
                  <a href="javascript:;" title="Go to page 1">
                    <span class="visually-hidden">Page</span>
                    {state.currentPage + 1}
                  </a>
                </li>
              </>
            )}

          {state.totalPages > 3 && state.currentPage < state.totalPages - 2 && (
            <li class="spacing">...</li>
          )}

          {state.currentPage >= 4 &&
            state.currentPage > state.totalPages - 3 && (
              <>
                <li class="spacing">...</li>
                {[...Array(3)].map((_, i) => (
                  <li
                    onClick={() => {
                      updatePage(state.totalPages - 3 + i);
                    }}
                    class={
                      state.totalPages - 3 + i === state.currentPage
                        ? "active"
                        : ""
                    }
                  >
                    <a
                      href="javascript:;"
                      title={`Ga naar pagina ${state.totalPages - 3 + i}`}
                    >
                      <span class="visually-hidden">Pagina</span>
                      {state.totalPages - 3 + i}
                    </a>
                  </li>
                ))}
              </>
            )}

          <li
            onClick={() => {
              updatePage(state.totalPages);
            }}
          >
            <a href="javascript:;" title={`Ga naar pagina ${state.totalPages}`}>
              <span class="visually-hidden">Pagina</span>
              {state.totalPages}
            </a>
          </li>
          {state.currentPage !== state.totalPages && (
            <li
              onClick={() => {
                updatePage(state.currentPage + 1);
              }}
              class="next"
            >
              <a href="javascript:;" class="standalone-link">
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
