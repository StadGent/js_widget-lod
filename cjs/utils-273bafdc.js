'use strict';

function format(first, middle, last) {
    return ((first || "") + (middle ? ` ${middle}` : "") + (last ? ` ${last}` : ""));
}
function isNumber(val) {
    return val && val !== "" && Number(val);
}
function getQueryWithoutLimit(query, paginationString) {
    return query.replace(new RegExp(`${paginationString}(?=\\s*$)`), "");
}
function getFormattedObjectValue(object) {
    if ((object === null || object === void 0 ? void 0 : object.datatype) === "http://www.w3.org/2001/XMLSchema#dateTime") {
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
    return (object === null || object === void 0 ? void 0 : object.value) || "";
}

exports.format = format;
exports.getFormattedObjectValue = getFormattedObjectValue;
exports.getQueryWithoutLimit = getQueryWithoutLimit;
exports.isNumber = isNumber;

//# sourceMappingURL=utils-273bafdc.js.map