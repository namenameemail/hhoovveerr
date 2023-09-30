import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TemplatesState } from "./types";
import { AppState } from "../../types";
// @ts-ignore
import { v4 as uuid } from 'uuid';
import { SizeUnit } from "../tree/types";
import { defaultDivStyleParameters } from "../tree/consts";
import { getInitialTreeState } from "../tree/helpers/getInitialTreeState";
import { defaultTemplateParameters } from "./consts";


const initialState: TemplatesState = {
    template: {},
    currentTemplateId: null,
};

export const brushesSlice = createSlice({
    name: 'templates',
    initialState,
    reducers: {
        setCurrentTemplate: (state: TemplatesState, action: PayloadAction<string>) => {
            state.currentTemplateId = action.payload;
        },
        newTemplate: (state: TemplatesState, action: PayloadAction<string>) => {
            const id = uuid();
            state.template = {
                ...state.template,
                [id]: {
                    id,
                    name: action.payload,
                    parameters: { ...defaultTemplateParameters },
                    tree: getInitialTreeState(),
                }
            };
        },
        deleteTemplate: (state: TemplatesState, action: PayloadAction<string>) => {

            const { [action.payload]: templateToDelete, ...newTemplateById } = state.template;

            state.template = newTemplateById
        },
        updateBrushStyleParameters: (state: TemplatesState, action: PayloadAction<{ index: number, brushStyleParameters: BrushStyleParameters }>) => {
            const newBrushes = [...state.brushes];
            newBrushes[action.payload.index] = {
                ...state.brushes[action.payload.index],
                brushStyleParameters: action.payload.brushStyleParameters
            };
            console.log(newBrushes);
            state.brushes = newBrushes;
            return state;
        },
    },
});

export const selectBrushes = (state: AppState) => state.currentProject.brushes.brushes;
export const selectCurrentBrush = (state: AppState) => state.currentProject.brushes.brushes[state.brushes.currentTemplateIndex];
export const selectCurrentBrushIndex = (state: AppState) => state.currentProject.brushes.currentTemplateIndex;
export const selectIsEditing = (state: AppState) => state.currentProject.brushes.editorOpen;


export const {
    newBrush,
    deleteBrush,
    setEditorOpen,
    setCurrentBrush,
    toggleEditorOpen,
    updateBrushStyleParameters
} = brushesSlice.actions;

