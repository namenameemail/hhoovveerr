import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EditorParams } from "./types";
import { AppState } from "../../types";

const initialState: EditorParams = {
    showInactivePath: false,
    inactivePathOpacity: 0.3,
    view: false,
    openActivePath: false
}

export const editorParamsSlice = createSlice({
    name: 'editorParams',
    initialState,
    reducers: {
        setEditorParams: (state: EditorParams, action: PayloadAction<EditorParams>) => {
            return action.payload;
        },
    },
});

export const {
    setEditorParams
} = editorParamsSlice.actions;

export const selectEditorParams = (state: AppState) => state.currentProject.editorParams;
