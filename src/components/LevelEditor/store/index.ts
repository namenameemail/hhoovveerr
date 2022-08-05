import { divTreeSlice } from "./divTree";
import { configureStore } from "@reduxjs/toolkit";
import { gameParamsSlice } from "./gameParams";
import logger from 'redux-logger';
import { editorParamsSlice } from "./editorParams";
import undoable from 'redux-undo';
import { activePathSlice } from "./activePath";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const divTree = undoable(divTreeSlice.reducer, {
    limit: 10,
    filter: action => {
        return !action.payload.nohistory
    }
})
export const store = configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    reducer: {
        divTree,
        activePath: activePathSlice.reducer,
        gameParams: gameParamsSlice.reducer,
        editorParams: editorParamsSlice.reducer,
    }
});


export type EditorState = ReturnType<typeof store.getState>;
export type EditorGetState = typeof store.getState;
export type EditorDispatch = typeof store.dispatch

export const useEditorDispatch: () => EditorDispatch = useDispatch
export const useEditorSelector: TypedUseSelectorHook<EditorState> = useSelector