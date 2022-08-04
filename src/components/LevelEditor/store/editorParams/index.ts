import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EditorState } from "../types";
import { EditorParams } from "./types";

const initialState: EditorParams = {
    hideInactivePath: false,
    inactivePathOpacity: 0.3,
    draw: true,
    view: false,
}

export const editorParamsSlice = createSlice({
    name: 'divTree',
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

// export const

export const selectEditorParams = (state: EditorState) => state.editorParams;
