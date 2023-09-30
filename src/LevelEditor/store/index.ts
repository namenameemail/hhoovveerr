import { configureStore, combineReducers } from "@reduxjs/toolkit";
import logger from 'redux-logger';
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { currentProjectReducer } from "./currentProject";
import { AppState } from "./types";
import { currentProjectIdSlice } from "./currentProjectId";
import { projectManagerSlice } from "./projectsManager";


const rootReducer = combineReducers<AppState>({
    projects: projectManagerSlice.reducer,
    currentProjectId: currentProjectIdSlice.reducer,
    currentProject: currentProjectReducer,
});

export const store = configureStore({
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    reducer: rootReducer
});


// export type AppState = ReturnType<typeof store.getState>;
export type AppGetState = typeof store.getState;
export type AppDispatch = typeof store.dispatch

export const useEditorDispatch: () => AppDispatch = useDispatch;
export const useEditorSelector: TypedUseSelectorHook<AppState> = useSelector;