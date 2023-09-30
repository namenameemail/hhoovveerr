import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProjectId } from "../projectsManager/types";
import { AppState } from "../types";

export type CurrentProjectIdState = ProjectId | null;

export const currentProjectIdSlice = createSlice<CurrentProjectIdState, {
    setCurrentProjectId: (state: CurrentProjectIdState, action: PayloadAction<ProjectId>) => CurrentProjectIdState,
}>({
    name: 'currentProjectId',
    initialState: null,
    reducers: {
        setCurrentProjectId: (state, action) => {
            return action.payload;
        },
    },
});

export const {
    setCurrentProjectId,
} = currentProjectIdSlice.actions;

export const selectCurrentProjectId = (state: AppState) => state.currentProjectId;
