import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TreeRegimeParams } from "./types";
import { AppState } from "../../types";

const initialState: TreeRegimeParams = {
    showInactivePath: false,
    inactivePathOpacity: 0.3,
    view: false,
    openActivePath: false
}

export const treeRegimeParamsSlice = createSlice({
    name: 'treeRegimeParams',
    initialState,
    reducers: {
        setTreeRegimeParams: (state: TreeRegimeParams, action: PayloadAction<TreeRegimeParams>) => {
            return action.payload;
        },
    },
});

export const {
    setTreeRegimeParams
} = treeRegimeParamsSlice.actions;

export const selectTreeRegimeParams = (state: AppState) => state.currentProject.editorParams;
