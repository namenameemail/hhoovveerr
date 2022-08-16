import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BrushesState, BrushState, BrushStyleParameters } from "./types";
import { EditorState } from "../index";
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';


const initialState: BrushesState = {
    brushes: [{
        brushStyleParameters: {
            color: 'white'
        }
    }, {
        brushStyleParameters: {
            color: 'grey'
        }
    }, {
        brushStyleParameters: {
            color: 'black'
        }
    }, {
        brushStyleParameters: {
            randomColor: true
        }
    }, ],
    editorOpen: false,
    currentBrushIndex: 0,
};

export const brushesSlice = createSlice({
    name: 'brushes',
    initialState,
    reducers: {
        toggleEditorOpen: (state: BrushesState) => {
            state.editorOpen = !state.editorOpen;
        },
        setEditorOpen: (state: BrushesState, action: PayloadAction<{ isOpen: boolean }>) => {
            state.editorOpen = action.payload.isOpen;
        },
        setCurrentBrush: (state: BrushesState, action: PayloadAction<{ index: number }>) => {
            state.currentBrushIndex = action.payload.index;
        },
        newBrush: (state: BrushesState) => {
            state.brushes = [...state.brushes, {
                brushStyleParameters: { randomColor: true }
            }];
        },
        updateBrushStyleParameters: (state: BrushesState, action: PayloadAction<{ index: number, brushStyleParameters: BrushStyleParameters }>) => {
            const newBrushes = [...state.brushes];
            newBrushes[action.payload.index] = {
                ...state.brushes[action.payload.index],
                brushStyleParameters: action.payload.brushStyleParameters
            };
            console.log(newBrushes)
            state.brushes = newBrushes;
            return state
        },
        deleteBrush: (state: BrushesState, action: PayloadAction<{ index: number }>) => {

            const newBrushes = [...state.brushes];
            const index = action.payload.index;

            if (newBrushes.length > 1 && index > -1) {
                newBrushes.splice(index, 1);
                state.brushes = newBrushes;
            }
        },
    },
});

export const selectBrushes = (state: EditorState) => state.brushes.brushes;
export const selectCurrentBrush = (state: EditorState) => state.brushes.brushes[state.brushes.currentBrushIndex];
export const selectCurrentBrushIndex = (state: EditorState) => state.brushes.currentBrushIndex;
export const selectIsEditing = (state: EditorState) => state.brushes.editorOpen;


export const {
    newBrush,
    deleteBrush,
    setEditorOpen,
    setCurrentBrush,
    toggleEditorOpen,
    updateBrushStyleParameters
} = brushesSlice.actions;

