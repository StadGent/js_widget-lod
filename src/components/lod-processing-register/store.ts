import { createStore } from "@stencil/store";
import { getPersonalDataProcessingList } from "../../services/queries";

export interface Facet {
  name: string;
  count: number;
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
  searchInput: "",
  searchInputFiltered: "",
  modalFilters: {} as { [key: string]: string },
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

export const updateSearchInput = (event: any) => {
  state.searchInput = event.target.value;
};

export const updateModalSearchFilter = (event: any, facetName: string) => {
  state.modalFilters = {
    ...state.modalFilters,
    [facetName]: event.target.value.toLowerCase(),
  };
};

export const updateData = async (newFilters?: boolean) => {
  state.searchInputFiltered = state.searchInput;
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

  if (state.searchInputFiltered.trim().length > 1) {
    params.set("where", `name like '%${state.searchInputFiltered}%'`);
  }

  params.set("offset", `${(state.currentPage - 1) * 10}`);
  params.set("limit", `10`);

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, "", newUrl);

  params.set(
    "apikey",
    "c5e39099e6c0c9d23041ef66b64cf82df92f31f27291836b97d57204",
  );

  state.queryData = await getPersonalDataProcessingList(params.toString());

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
