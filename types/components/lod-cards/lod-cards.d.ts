export declare class LodCards {
    endpoint: string;
    query: string;
    countQuery: string;
    itemsPerPage: string;
    ctaText: string;
    ctaUrl: string;
    queryModified: string;
    count: number;
    page: number;
    items: any[];
    paginationString: string;
    _itemsPerPage: number;
    pagesResult: {
        page: number;
        result: any;
    }[];
    currentPageItems: any;
    isFetching: boolean;
    visualPage: number;
    componentWillLoad(): void;
    get queryUrl(): URL;
    executeCountQuery(): Promise<void>;
    executeQuery(): Promise<void>;
    get queryWithoutLimit(): string;
    decrementPage(): Promise<void>;
    incrementPage(): Promise<void>;
    render(): any;
}
