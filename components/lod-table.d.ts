import type { Components, JSX } from "../types/components";

interface LodTable extends Components.LodTable, HTMLElement {}
export const LodTable: {
    prototype: LodTable;
    new (): LodTable;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
