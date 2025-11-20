import { createStore } from "@stencil/store";
import {
  getBaseFacets,
  getPersonalDataProcessingList,
} from "../../services/queries";
import { isString } from "../../utils/utils";

export interface Facet {
  name: string;
  count?: number;
  checked?: boolean;
  facets: FacetChild[];
}

export interface FacetChild {
  name: string;
  count: number;
  checked: boolean;
}

export interface FacetData {
  id: string;
  uri: string;
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
  facetFilters: [] as Facet[],
  modalsMade: false,
  checkedFacets: undefined as Facet[] | undefined,
  disjunctiveFacets: undefined as Facet[] | undefined,
  appliedFilters: undefined as Facet[] | undefined,
  totalPages: undefined as number | undefined,
  currentPage: undefined as number | undefined,
  searchInput: "",
  isUpdatingData: false,
  searchInputFiltered: "",
  modalFilters: {} as { [key: string]: string },
  initialAnimationFinished: false,
  itemsPerPage: 10,
  opendataSoftEndpoint:
    "https://data.stad.gent/api/explore/v2.1/catalog/datasets/verwerkingsregister-stad-gent",
  sparqlEndpoint: "https://stad.gent/sparql",
  openDataSoftPublicApiKey:
    "c5e39099e6c0c9d23041ef66b64cf82df92f31f27291836b97d57204",
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
  state.totalPages = Math.ceil(
    updatedQueryData.total_count / state.itemsPerPage,
  );
});

const updateFacetCount = () => {
  setNewFacetCounts();
};

export const updateSearchInput = (event: any) => {
  state.searchInput = event.target.value;
};

export const setNewFacetCounts = async () => {
  const data = await getBaseFacets(
    state.searchInput,
    state.disjunctiveFacets,
    state.checkedFacets,
  );

  const updatedFacets = state.facetFilters.map((existingGroup) => {
    const updatedGroup = data.facets.find((f) => f.name === existingGroup.name);

    if (!updatedGroup) return existingGroup;

    return {
      ...existingGroup,
      facets: existingGroup.facets
        .filter((child) => isString(child.name))
        .map((facetChild) => {
          const updatedChild = updatedGroup.facets.find(
            (f) => f.name === facetChild.name,
          );

          return {
            ...facetChild,
            count: updatedChild ? updatedChild.count : 0,
          };
        }),
    };
  });

  state.baseFacets = updatedFacets;
};

export const setBaseFacets = async () => {
  const params = new URLSearchParams(window.location.search);
  const data = await getBaseFacets();

  state.baseFacets = data.facets.map((facetGroup) => ({
    ...facetGroup,
    facets: facetGroup.facets.filter((f) => f.name !== ""),
  }));

  data.facets.forEach((facet) => {
    state.modalFilters[facet.name] = "";
  });

  state.facetFilters = data.facets.map((facet) => ({
    name: facet.name,
    facets: facet.facets.map((facetChild) => {
      return {
        name: facetChild.name,
        count: facetChild.count,
        checked: params
          .getAll("refine")
          .includes(`${facet.name}:${facetChild.name}`),
      };
    }),
  }));

  await setNewFacetCounts();
  state.appliedFilters = state.disjunctiveFacets;
};

export const updateModalSearchFilter = (event: any, facetName: string) => {
  state.modalFilters = {
    ...state.modalFilters,
    [facetName]: event.target.value.toLowerCase(),
  };
};

export const updateData = async (newFilters?: boolean) => {
  state.isUpdatingData = true;
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
    params.set("where", `search(name, "${state.searchInputFiltered}")`);
  }

  params.set("offset", `${(state.currentPage - 1) * state.itemsPerPage}`);
  params.set("limit", state.itemsPerPage.toString());

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, "", newUrl);

  params.set("apikey", state.openDataSoftPublicApiKey);

  state.queryData = await getPersonalDataProcessingList(params.toString());

  document.getElementById("lod-processing-register").scrollIntoView();
  state.appliedFilters = state.disjunctiveFacets;
  updateFacetCount();
  state.isUpdatingData = false;
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
  setNewFacetCounts();
  updateData(true);
};

export const updatePage = (page: number) => {
  if (page >= 1 && page <= state.totalPages && page !== state.currentPage) {
    state.currentPage = page;
    updateData();
  }
};

export default state;
