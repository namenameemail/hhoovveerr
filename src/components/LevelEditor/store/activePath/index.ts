import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EditorState } from "../index";

export const activePathSlice = createSlice({
    name: 'activePath',
    initialState: '',
    reducers: {
        setActivePath: (state: string, action: PayloadAction<string>) => {
            return action.payload;
        },
        resetActivePath: (state: string) => {
            return '';
        },
    },
});

export const {
    setActivePath,
    resetActivePath,
} = activePathSlice.actions;

export const selectActivePath = (state: EditorState) => state.activePath;
