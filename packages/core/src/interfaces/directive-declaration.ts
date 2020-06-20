import * as ts from 'typescript';

export interface PropertyDeclaration {
    name: string;
    type: string;
    description?: string;
    default?: string;
}

export interface DirectiveDeclaration {
    type: 'directive' | 'component';
    name: string;
    description?: string;
    properties?: Array<PropertyDeclaration>;
}
