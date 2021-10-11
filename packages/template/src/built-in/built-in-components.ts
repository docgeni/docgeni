import { BuiltInComponentDef } from './built-in-component';

let builtInComponents: BuiltInComponentDef[];
export function setBuiltInComponents(components: BuiltInComponentDef[]) {
    builtInComponents = components || [];
}

export function getBuiltInComponents(): BuiltInComponentDef[] {
    return builtInComponents;
}

export function addBuiltInComponents(components: BuiltInComponentDef[]) {
    builtInComponents = builtInComponents ? builtInComponents.concat(components) : components;
}
