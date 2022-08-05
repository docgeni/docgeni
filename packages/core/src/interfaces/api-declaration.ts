export interface PropertyType {
    name: string;
    options?: (string | number)[] | null;
    kindName?: string;
}

export interface PropertyDeclaration {
    name: string;
    aliasName?: string;
    kind: 'Input' | 'Output' | 'ContentChild' | 'ContentChildren';
    type: string | PropertyType;
    description?: string;
    default?: string;
    tags?: Record<
        string,
        {
            name: string;
            text: { text: string; kind: string }[];
        }
    >;
}

export interface ApiDeclaration {
    type: 'directive' | 'component' | 'service' | 'interface' | 'class';
    name: string;
    className: string;
    selector: string;
    exportAs: string;
    description?: string;
    properties?: Array<PropertyDeclaration>;
}
