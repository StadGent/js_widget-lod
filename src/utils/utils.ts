export function format(first?: string, middle?: string, last?: string): string {
  return (
    (first || "") + (middle ? ` ${middle}` : "") + (last ? ` ${last}` : "")
  );
}

export function isNumber(val: string | undefined | null) {
  return val && val !== "" && Number(val);
}

export function getQueryWithoutLimit(query: string, paginationString: string) {
  return query.replace(new RegExp(`${paginationString}(?=\\s*$)`), "");
}

type DataObject = {
  datatype: string;
  value: string;
};

export function getFormattedObjectValue(object: DataObject) {
  if (object?.datatype === "http://www.w3.org/2001/XMLSchema#dateTime") {
    var dateString = object.value;

    const date = new Date(dateString);
    return date.toLocaleString(["nl-BE"], {
      weekday: "short",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return object?.value || "";
}

export function toKebabCase(input: string): string {
  return input
    .toLowerCase() // Step 1: Lowercase
    .replace(/[^a-z0-9\s]/g, "") // Step 2: Remove special characters (except space)
    .trim() // Step 3: Trim leading/trailing spaces
    .replace(/\s+/g, "-"); // Step 4: Replace spaces with hyphens
}

export function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export function isString(string: string | undefined | null) {
  return string !== undefined && string !== null && string.length > 0;
}
