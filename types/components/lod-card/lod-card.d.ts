export declare class LodCard {
    cardTitle: string;
    description: string;
    address: string;
    addressUrl: string;
    date: string;
    tag: string;
    imageUrl: string;
    readMoreText: string;
    readMoreUrl: string;
    private get tagSplitted();
    private get imageUrlFormatted();
    private get readMoreTextFormatted();
    render(): any;
}
