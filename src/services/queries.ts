import { type Facet } from "../components/lod-processing-register/store";
import { isString } from "../utils/utils";
import { fetchJson } from "./apiClient";
import state from "../components/lod-processing-register/store";

const openDataPortalUrl =
  "https://data.stad.gent/api/explore/v2.1/catalog/datasets/verwerkingsregister-stad-gent";
const publicApiKey = "c5e39099e6c0c9d23041ef66b64cf82df92f31f27291836b97d57204";

export async function getProcessingRegisterDetail(id: string) {
  return fetchJson(`/api/users/${id}`);
}

export async function getBaseFacets(
  name?: string,
  disjunctiveFacets?: Facet[],
  checkedFacets?: Facet[],
) {
  const baseUrl = `${openDataPortalUrl}/facets?facet=processor&facet=personaldata&facet=grantees&facet=type&facet=formal_framework&facet=audience`;
  const url = new URL(baseUrl);

  const params = new URLSearchParams();

  // Add complex facet (with nested name and disjunctive)

  disjunctiveFacets?.forEach((facet) =>
    params.append("facet", `facet(name="${facet.name}",disjunctive=true)`),
  );

  if (isString(name)) {
    params.set("where", `name like '%${name}%'`);
  }

  // Add additional facet parameters
  const additionalFacets = checkedFacets?.filter(
    (facet) => !(facet.facets.length > 0),
  );
  additionalFacets?.forEach((facet) => {
    params.append("facet", facet.name);
  });

  disjunctiveFacets?.forEach((facet) =>
    facet.facets.forEach((childFacet) =>
      params.append("refine", `${facet.name}:${childFacet.name}`),
    ),
  );

  params.set("apikey", publicApiKey);

  // Remove audience from facets
  const data = await fetchJson(`${url.toString()}&${params.toString()}`);
  data.facets = data.facets.filter((facet) => facet.name !== "audience");
  return fetchJson(`${url.toString()}&${params.toString()}`);
}

export async function getPersonalDataProcessingList(
  queryParams: string,
): Promise<any>;
export async function getPersonalDataProcessingList(
  offset: number,
): Promise<any>;

export async function getPersonalDataProcessingList(param: string | number) {
  let baseUrl = "";
  if (typeof param === "number") {
    baseUrl = `${openDataPortalUrl}/records?limit=${state.itemsPerPage}&offset=${param}&apikey=${publicApiKey}`;
  } else {
    baseUrl = `${openDataPortalUrl}/records${param.startsWith("?") ? "" : "?"}${param}&apikey=${publicApiKey}`;
  }
  return fetchJson(baseUrl);
}

export async function getPersonalDataProcessingDetail(
  id: string,
): Promise<ProcessingRegisterDetailItem> {
  const url = new URL("https://stad.gent/sparql");
  const query = `
  PREFIX skos: <http://www.w3.org/2004/02/skos/core#> 
  PREFIX dcterms: <http://purl.org/dc/terms/> 
  PREFIX gdv: <http://stad.gent/data/ns/data-processing/> 
  SELECT  
  ?id  
  ?description 
  ?processor
  ?type 
  ?name 
  ?personalDataDescription 
  ?sensitivePersonalDataDescription 
  (group_concat(distinct ?personalData;separator=',') as ?personalData) 
  (group_concat(distinct ?sensitivePersonalData;separator=',') as ?sensitivePersonalData) 
  ?formal_framework 
  ?formal_framework_clarification 
  (group_concat(distinct ?grantee;separator=',') as ?grantees) 
  ?storagePeriod 
  FROM <http://stad.gent/data-processes/> 
  WHERE { 
    ?verwerking a <http://data.vlaanderen.be/ns/toestemming#VerwerkingsActiviteit>; 
    dcterms:identifier ?id; 
    dcterms:description ?description; 
    dcterms:type/skos:prefLabel ?type; 
    dcterms:title ?name;  
    dcterms:temporal/dcterms:title ?storagePeriod;
    <http://data.vlaanderen.be/ns/toestemming#verwerkingsgrond>/skos:prefLabel ?formal_framework;
    <http://data.vlaanderen.be/ns/toestemming#verwerker>/skos:prefLabel ?processor.
    OPTIONAL { ?verwerking gdv:verduidelijkingRechtsgrond ?formal_framework_clarification }
    OPTIONAL { ?verwerking <http://stad.gent/data/ns/data-processing/grantee>/skos:prefLabel ?grantee }
    OPTIONAL { ?verwerking <http://stad.gent/data/ns/data-processing/hasPersonalData>/dcterms:type/skos:prefLabel ?personalData } 
    OPTIONAL { ?verwerking <http://stad.gent/data/ns/data-processing/hasSensitivePersonalData>/dcterms:type/skos:prefLabel ?sensitivePersonalData } 
    OPTIONAL { ?verwerking <http://stad.gent/data/ns/data-processing/hasPersonalData>/dcterms:description ?personalDataDescription } 
    OPTIONAL { ?verwerking <http://stad.gent/data/ns/data-processing/hasSensitivePersonalData>/dcterms:description ?sensitivePersonalDataDescription } 
    FILTER (STR(?id)='${id}')
}`;
  url.searchParams.set("query", query);

  const data = await fetchJson(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/sparql-results+json",
    },
  });

  return data.results.bindings[0];
}
