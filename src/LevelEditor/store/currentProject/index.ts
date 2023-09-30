import { treeSliceUndoableReducer } from "./tree";
import { currentRegimeSlice } from "./currentRegime";
import { gameParamsSlice } from "./gameParams";
import { editorParamsSlice } from "./editorParams";
import { treeRegimeParamsSlice } from "./treeRegimeParams";
import { templateRegimeParamsSlice } from "./templateRegimeParams";
import { assetsSlice } from "./assets";
import { combineReducers } from "@reduxjs/toolkit";

export const currentProjectReducer = combineReducers({
    tree: treeSliceUndoableReducer,
    currentRegime: currentRegimeSlice.reducer,
    gameParams: gameParamsSlice.reducer,
    editorParams: editorParamsSlice.reducer,
    treeRegimeParams: treeRegimeParamsSlice.reducer,
    templateRegimeParams: templateRegimeParamsSlice.reducer,
    assets: assetsSlice.reducer,
})