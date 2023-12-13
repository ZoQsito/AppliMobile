declare class TimelineEngine {
    /**
     * @param  {Theme} theme
     * @param  {Renderer} renderer
     * @param  {Legend} legend
     * @param  {Element} threshold
     * @param  {Object} request
     * @param  {Number} eventHeight
     * @param  {Number} horizontalMargin
     */
    constructor(theme: Theme, renderer: Renderer, legend: Legend, threshold: Element, request: Object, eventHeight?: number, horizontalMargin?: number);
    theme: Theme;
    renderer: Renderer;
    legend: Legend;
    threshold: Element;
    request: Object;
    scale: number;
    eventHeight: number;
    horizontalMargin: number;
    labelY: number;
    periodY: number;
    FqcnMatcher: RegExp;
    origin: any;
    createEventElements(event: any): any;
    createBackground(event: any): any;
    createPeriod(period: any, category: any): any;
    render(): void;
    renderEvent(event: any, index: any): void;
    renderPeriod(period: any): void;
    onResize(): void;
    isActive(event: any): any;
    setScale(scale: any): void;
    createElements(): void;
    createLabel(name: any, duration: any, memory: any, period: any): any;
    createBorder(): any;
    renderLabel(label: any, event: any): void;
    getLabelWidth(label: any): any;
    getEventLimits(event: any): any;
    getShortName(name: any): any;
}
declare class Legend {
    constructor(element: any, theme: any);
    element: any;
    theme: any;
    toggle(event: any): void;
    createCategory(category: any): HTMLButtonElement;
    categories: any[];
    add(category: any): void;
    isActive(category: any): any;
    get(category: any): any;
    emit(name: any): void;
    addEventListener(name: any, callback: any): void;
    removeEventListener(name: any, callback: any): void;
}
declare class SvgRenderer {
    /**
     * @param  {SVGElement} element
     */
    constructor(element: SVGElement);
    ns: string;
    width: number | null;
    viewBox: {};
    element: SVGElement;
    add(element: any): void;
    setViewBox(x: any, y: any, width: any, height: any): void;
    measure(): void;
    group(elements: any, className: any): Element;
    setHorizontalLine(element: any, x: any, y: any, width: any): any;
    setVerticalLine(element: any, x: any, y: any, height: any): any;
    setFullHorizontalLine(element: any, y: any): any;
    setFullVerticalLine(element: any, x: any): any;
    setFullRectangle(element: any, min: any, max: any): void;
    setSectionLine(element: any, x: any, y: any, width: any, height?: number, markerSize?: number): void;
    setPeriodLine(element: any, x: any, y: any, width: any, height?: number, markerWidth?: number, markerHeight?: number): void;
    createText(content: any, x: any, y: any, className: any): Element;
    createTspan(content: any, className: any): Element;
    createTitle(content: any): Element;
    createPath(path?: null, className?: null, color?: null): Element;
    create(name: any, className?: null): Element;
}
declare class Theme {
    constructor(element: any);
    reservedCategoryColors: {
        default: string;
        section: string;
        event_listener: string;
        template: string;
        doctrine: string;
        messenger_middleware: string;
        'controller.argument_value_resolver': string;
        http_client: string;
    };
    customCategoryColors: string[];
    getCategoryColor(category: any): any;
    getDefaultCategories(): string[];
    getRandomColor(category: any): string;
    hash(string: any): number;
}
