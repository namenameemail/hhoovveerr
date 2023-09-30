import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../../types";

export enum Regime {
    Tree = 'tree',
    Template = 'template',
    Condition = 'conditions',
    Assets = 'assets',
    Export = 'export',
    Preview = 'preview'
}

export type CurrentRegimeState = Regime

export const currentRegimeSlice = createSlice({
    name: 'activeElement',
    initialState: Regime.Tree,
    reducers: {
        setRegime: (state: CurrentRegimeState, action: PayloadAction<CurrentRegimeState>) => {
            return action.payload;
        },
    },
});

export const {
    setRegime,
} = currentRegimeSlice.actions;

export const selectCurrentRegime = (state: AppState) => state.currentProject.currentRegime;
