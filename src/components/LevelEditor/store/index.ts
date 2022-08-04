import { divTreeSlice } from "./divTree";
import { configureStore } from "@reduxjs/toolkit";
import { gameParamsSlice } from "./gameParams";
import logger from 'redux-logger'
import { editorParamsSlice } from "./editorParams";


export const store = configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    reducer: {
        divTree: divTreeSlice.reducer,
        gameParams: gameParamsSlice.reducer,
        editorParams: editorParamsSlice.reducer,
    }
});