export interface PropertyType {
    name: string;
    options?: (string | number)[] | null;
    kindName?: string;
}

export interface PropertyDeclaration {
    name: string;
    type: string | PropertyType;
    description?: string;
    default?: string;
}

export interface ApiDeclaration {
    type: 'directive' | 'component' | 'service' | 'interface' | 'class';
    name: string;
    description?: string;
    properties?: Array<PropertyDeclaration>;
}
