import { DivId, Tree } from "../currentProject/tree/types";
import { Assets } from "../currentProject/assets/types";
import { TemplatesState } from "../currentProject/templates/types";
import { EditorParams } from "../currentProject/editorParams/types";
import { Regime } from "../currentProject/currentRegime";

export type ProjectId = string

export type Project = {
    name: string
    id: ProjectId

    tree: Tree
    // templates: TemplatesState
    assets: Assets
    editorParams: EditorParams
    currentRegime: Regime
}

export type ProjectById = Record<ProjectId, Project>

export type Projects = {
    project: ProjectById
    isProjectManagerOpen: boolean
}