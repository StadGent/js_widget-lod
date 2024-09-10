export declare function format(first?: string, middle?: string, last?: string): string;
export declare function isNumber(val: string | undefined | null): number;
export declare function getQueryWithoutLimit(query: string, paginationString: string): string;
type DataObject = {
    datatype: string;
    value: string;
};
export declare function getFormattedObjectValue(object: DataObject): string;
export {};
