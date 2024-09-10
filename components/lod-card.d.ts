import type { Components, JSX } from "../types/components";

interface LodCard extends Components.LodCard, HTMLElement {}
export const LodCard: {
    prototype: LodCard;
    new (): LodCard;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
