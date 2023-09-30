import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GameParams } from "./types";
import { AppState } from "../../types";

const initialState: GameParams = {
    backgroundColor: 'lightgrey',
};

export const gameParamsSlice = createSlice({
    name: 'gameParams',
    initialState,
    reducers: {
        setGameParams: (state: GameParams, action: PayloadAction<GameParams>) => {
            return action.payload;
        },
    },
});

export const {
    setGameParams
} = gameParamsSlice.actions;

export const selectGameParams = (state: AppState) => state.currentProject.gameParams;
