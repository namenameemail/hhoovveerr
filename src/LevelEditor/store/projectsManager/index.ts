import { AnyAction, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit";
import { AppState } from "../types";
import { ProjectById, Projects, Project } from "./types";
import { v4 as uuid } from 'uuid';
import { setRegime } from "../currentProject/currentRegime";
import { getEmptyProject } from "./helpers";
import { setCurrentProjectId } from "../currentProjectId";
import { setTreeState, setActiveDiv } from "../currentProject/tree";
import { setAssetsState, updateAllAssets } from "../currentProject/assets";
import { projectsStore } from "../../services/db/stores/projects";
import { fontsStore, imagesStore } from "../../services/db/stores/assets";

export const projectManagerSlice = createSlice({
    name: 'activeElement',
    initialState: {
        project: {},
        isProjectManagerOpen: true,
    },
    reducers: {
        setProjects: (state: Projects, action: PayloadAction<ProjectById>) => {
            state.project = action.payload;
        },
        setProjectManagerOpen: (state: Projects, action: PayloadAction<boolean>) => {
            state.isProjectManagerOpen = action.payload;
        },
        addProject: (state: Projects, action: PayloadAction<Project>) => {
            return {
                ...state,
                project: {
                    ...state.project,
                    [action.payload.id]: action.payload
                }
            };
        },
        removeProject: (state: Projects, action: PayloadAction<string>) => {
            const { [action.payload]: deleted, ...project } = state.project;
            return {
                ...state,
                project,
            };
        },
    },
});

export const {
    // addProject,
    // removeProject,
    setProjects,
    setProjectManagerOpen,
} = projectManagerSlice.actions;

export const selectProjects = (state: AppState) => state.projects.project;
export const selectIsProjectManagerOpen = (state: AppState) => state.projects.isProjectManagerOpen;

export const loadProjectsFromDb = (): ThunkAction<void, AppState, unknown, AnyAction> =>
    async (dispatch, getState) => {

        try {
            const projects = await projectsStore.getAll();

            dispatch(projectManagerSlice.actions.setProjects(
                projects.reduce((res, project) => ({
                    ...res,
                    [project.id]: project
                }), {})
            ));
        } catch (error) {

        }
    };

export const addEmptyProject = ({ name }: { name: string }): ThunkAction<void, AppState, unknown, AnyAction> =>
    async (dispatch, getState) => {

        try {
            const newProject: Project = {
                id: uuid(),
                name,
                ...getEmptyProject(),
            };

            await projectsStore.put(newProject);

            // dispatch(projectManagerSlice.actions.addProject(newProject));
            dispatch(loadProjectsFromDb());
        } catch (error) {

        }

    };

export const removeProject = (id: string): ThunkAction<void, AppState, unknown, AnyAction> =>
    async (dispatch, getState) => {

        const projectToDelete = getState().projects.project[id];

        if (!projectToDelete) {
            return;
        }

        try {

            await Promise.all(projectToDelete.assets.images.map((imageAsset) => imagesStore.remove(imageAsset.id)))
            await Promise.all(projectToDelete.assets.fonts.map((fontAsset) => fontsStore.remove(fontAsset.id)))

            await projectsStore.remove(id);

            dispatch(loadProjectsFromDb());
        } catch (error) {

        }

        dispatch(projectManagerSlice.actions.removeProject(id));
    };

export const openProject = (id: string): ThunkAction<void, AppState, unknown, AnyAction> =>
    (dispatch, getState) => {
        const project = getState().projects.project[id];

        if (!project) {
            return;
        }

        dispatch(setProjectManagerOpen(false));

        dispatch(setCurrentProjectId(id));
        dispatch(setRegime(project.currentRegime));
        dispatch(setTreeState(project.tree));
        dispatch(setAssetsState(project.assets));
        dispatch(updateAllAssets());
    };

export const saveCurrentProject = (): ThunkAction<void, AppState, unknown, AnyAction> => async (dispatch, getState) => {
    const state = getState();

    const { currentProjectId, currentProject, projects } = state;

    if (!currentProjectId) {
        return
    }

    const projectToSave: Project = {
        id: currentProjectId,
        name: projects.project[currentProjectId].name,
        tree: currentProject.tree.present,
        // templates: currentProject.
        assets: currentProject.assets,
        editorParams: currentProject.editorParams,
        currentRegime: currentProject.currentRegime,
    }

    try {
        await projectsStore.put(projectToSave);

        dispatch(loadProjectsFromDb());
    } catch (error) {

    }

};