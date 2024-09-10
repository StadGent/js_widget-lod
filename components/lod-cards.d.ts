import type { Components, JSX } from "../types/components";

interface LodCards extends Components.LodCards, HTMLElement {}
export const LodCards: {
    prototype: LodCards;
    new (): LodCards;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
