import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TemplateRegimeParams } from "./types";
import { AppState } from "../../types";

const initialState: TemplateRegimeParams = {
    showInactivePath: false,
    inactivePathOpacity: 0.3,
    view: false,
    openActivePath: false
}

export const templateRegimeParamsSlice = createSlice({
    name: 'editorParams',
    initialState,
    reducers: {
        setTemplateRegimeParams: (state: TemplateRegimeParams, action: PayloadAction<TemplateRegimeParams>) => {
            return action.payload;
        },
    },
});

export const {
    setTemplateRegimeParams
} = templateRegimeParamsSlice.actions;

export const selectTemplateRegimeParams = (state: AppState) => state.currentProject.editorParams;
