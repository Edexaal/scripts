interface Options {
    capture?: boolean,
    once?: boolean,
    passive?: boolean
}

interface NewElement {
    element: string,
    class?: string[],
    text?: string,

    [key: string]: string | string[] | undefined
}

type EventOptions = Options | boolean;
type EventCallback = (e: Event) => void;
declare namespace Edexal {
    function addCSS(css: string): void;

    function newEl(elObj: NewElement): HTMLElement;

    function on(el: Element, eventType: string, callback: EventCallback, options?: EventOptions): void;

    function off(el: Element, eventType: string, callback: (e: Event) => void, options?: EventOptions): void;

    function $(selectors: string): HTMLElement;

    function $$(selectors: string): NodeList;

    function runOnBookmarkPage(callback: () => void): void;

    function runOnLatestUpdatePage(callback: () => void): void;

}