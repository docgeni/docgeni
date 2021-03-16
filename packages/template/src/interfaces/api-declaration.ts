export interface PropertyDeclaration {
    name: string;
    type: string;
    description?: string;
    default?: string;
}

export interface ApiDeclaration {
    type: 'directive' | 'component' | 'service' | 'interface' | 'class';
    name: string;
    description?: string;
    properties?: Array<PropertyDeclaration>;
}
