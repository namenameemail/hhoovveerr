import { Project } from "./types";
import { getInitialTreeState } from "../currentProject/tree/helpers/getInitialTreeState";
import { Regime } from "../currentProject/currentRegime";

export const getEmptyProject: () => Omit<Project, 'id' | 'name'> = () => ({
    tree: {
        ...getInitialTreeState()
    },
    templates: {
        template: {}
    },
    assets: {
        images: [],
        fonts: []
    },
    editorParams: {
        showInactivePath: false,
        inactivePathOpacity: 0,
        view: false,
        openActivePath: true,
    },
    activeElement: '',
    currentRegime: Regime.Tree
})