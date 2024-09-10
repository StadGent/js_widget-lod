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
