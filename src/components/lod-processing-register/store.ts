import { createStore } from "@stencil/store";

export interface Facet {
  name: string;
  facets: Facet[];
}

export interface FacetFilter {
  name: string;
  facets: { name: string; checked: boolean }[];
}

export interface FacetData {
  id: string;
  processor: string;
  type: string;
  name: string;
  formal_framework: string;
  audience: string;
}

export interface QueryData {
  total_count: number;
  results: FacetData[];
}

const { state, onChange } = createStore({
  queryData: undefined as QueryData | undefined,
  baseFacets: undefined as Facet[] | undefined,
  facetFilters: [] as FacetFilter[],
  modalsMade: false,
  checkedFacets: undefined as FacetFilter[] | undefined,
  disjunctiveFacets: undefined as FacetFilter[] | undefined,
  totalPages: undefined as number | undefined,
  currentPage: undefined as number | undefined,
});

onChange("facetFilters", (updatedFacets) => {
  state.checkedFacets = updatedFacets.map((facet) => ({
    name: facet.name,
    facets: facet.facets.filter((child) => child.checked === true),
  }));
});

onChange("checkedFacets", (updatedFacets) => {
  state.disjunctiveFacets = updatedFacets.filter(
    (facet) => facet.facets.length > 0,
  );
});

onChange("queryData", (updatedQueryData) => {
  state.totalPages = Math.ceil(updatedQueryData.total_count / 10);
});

onChange("currentPage", (updatedPage) => {
  const url = new URL(window.location.href);
  url.searchParams.set("page", updatedPage.toString());
  window.history.replaceState({}, "", url.toString());
});

export const updateData = async (newFilters?: boolean) => {
  if (newFilters) {
    state.currentPage = 1;
  }
  const params = new URLSearchParams();

  // Add complex facet (with nested name and disjunctive)

  state.disjunctiveFacets.forEach((facet) =>
    params.append("facet", `facet(name="${facet.name}",disjunctive=true)`),
  );

  // Add additional facet parameters
  const additionalFacets = state.checkedFacets.filter(
    (facet) => !(facet.facets.length > 0),
  );
  additionalFacets.forEach((facet) => {
    params.append("facet", facet.name);
  });

  state.disjunctiveFacets.forEach((facet) =>
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
  params.set("offset", `${(state.currentPage - 1) * 10}`);
  params.set("limit", `10`);
  const url = `${baseUrl}?${params.toString()}`;

  const response = await fetch(url);
  state.queryData = await response.json();

  document.getElementById("lod-processing-register").scrollIntoView();
};

export const toggleChecked = (facet: string, facetChild: string) => {
  state.facetFilters = state.facetFilters.map((item) => {
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
};

export const updatePage = (page: number) => {
  if (page >= 1 && page <= state.totalPages && page !== state.currentPage) {
    state.currentPage = page;
    updateData();
  }
};

export default state;
