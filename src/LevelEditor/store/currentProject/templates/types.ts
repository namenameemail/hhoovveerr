import { Tree } from "../tree/types";

export type TemplateId = string;

export type TemplateParameters = {
    randomColor?: boolean
}

export type Template = {
    id: TemplateId;
    name: string
    parameters: TemplateParameters
    tree: Tree
}

export type TemplateById = Record<TemplateId, Template | undefined>

export type TemplatesState = {
    template: TemplateById,
    currentTemplateId: TemplateId | null,
}

