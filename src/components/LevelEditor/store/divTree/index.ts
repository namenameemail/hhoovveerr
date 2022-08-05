import { AnyAction, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit";
import { DivParameters, DivState, DivTreeState } from "./types";
import { PATH_SPLITTER } from "./consts";
import { EditorDispatch, EditorGetState, EditorState } from "../index";
import { setActivePath } from "../activePath";
import { addByPath, deleteByPath, getByPath, getPathParentAndIndex, updateByPath } from "../../utils/tree";


const initialState: DivTreeState = {
    root: {
        parameters: {
            startPoint: [0, 0],
            size: [60, 60],
            angle: 0,
            color: 'pink',
            relativeSizeX: true,
            relativeSizeY: true,
            relativeStartX: true,
            relativeStartY: true,
        },

        children: [],
    },
};


export const divTreeSlice = createSlice({
    name: 'divTree',
    initialState,
    reducers: {
        setRoot: (state: DivTreeState, action: PayloadAction<DivState>) => {
            state.root = action.payload;
        },
        changeColor: (state: DivTreeState, action: PayloadAction<{ color: string, path: string }>) => {
            const { path, color } = action.payload;
            state.root = updateByPath(state.root, path, (state) => ({
                ...state,
                parameters: {
                    ...state.parameters,
                    color,
                }
            }));
        },
        updateDiv: (state: DivTreeState, action: PayloadAction<{ divState: DivState, path: string, nohistory?: boolean }>) => {
            const { path, divState } = action.payload;
            state.root = updateByPath(state.root, path, () => divState);
        },
        updateDivParameters: (state: DivTreeState, action: PayloadAction<{ divParams: DivParameters, path: string, nohistory?: boolean }>) => {
            const { path, divParams } = action.payload;
            state.root = updateByPath(state.root, path, (state: DivState) => ({
                ...state,
                parameters: divParams
            }));
        },
        deleteDiv: (state: DivTreeState, action: PayloadAction<{ path: string }>) => {
            if (action.payload.path) {
                state.root = deleteByPath(state.root, action.payload.path);
            }
        },
        addChildren: (state: DivTreeState, action: PayloadAction<{ divState: DivState, path: string }>) => {
            const { path, divState } = action.payload;
            state.root = addByPath(state.root, path, divState);
        },
        divUp: (state: DivTreeState, action: PayloadAction<{ path: string }>) => {
            const { parentPath, index } = getPathParentAndIndex(action.payload.path);

            state.root = updateByPath(state.root, parentPath, (divState: DivState) => {
                if (index < divState.children.length - 1) {
                    const newChildren = [...divState.children];
                    const temp = newChildren[index + 1];
                    newChildren[index + 1] = newChildren[index];
                    newChildren[index] = temp;

                    return {
                        ...divState,
                        children: newChildren,
                    };
                } else {
                    return divState;
                }
            });
        },
        divDown: (state: DivTreeState, action: PayloadAction<{ path: string }>) => {
            const { parentPath, index } = getPathParentAndIndex(action.payload.path);

            state.root = updateByPath(state.root, parentPath, (divState: DivState) => {
                if (index > 0) {
                    const newChildren = [...divState.children];
                    const temp = newChildren[index - 1];
                    newChildren[index - 1] = newChildren[index];
                    newChildren[index] = temp;
                    return {
                        ...divState,
                        children: newChildren,
                    };
                } else {
                    return divState;
                }
            });
        },
    },
});

export const selectDivTreeRoot = (state: EditorState) => state.divTree.present.root;
export const selectDivByPath = (path: string) => (state: EditorState) => getByPath(state.divTree.present.root, path);

export const {
    setRoot,
    changeColor,
    updateDiv,
    updateDivParameters,
    addChildren,
} = divTreeSlice.actions;

export const deleteDiv = ({ path }: { path: string }): ThunkAction<void, EditorState, unknown, AnyAction> => (dispatch, getState) => {
    if (!path) return;

    dispatch(divTreeSlice.actions.deleteDiv({ path }));

    const { parentPath, index: deletedIndex } = getPathParentAndIndex(path);
    const parent = selectDivByPath(parentPath)(getState());

    dispatch(setActivePath(
        parent?.children.length
            ? ((parentPath ? (parentPath + '-') : '') + (
                deletedIndex > parent.children.length - 1
                    ? parent.children.length - 1
                    : deletedIndex
            ))
            : parentPath
    ));
};
export const divUp = ({ path }: { path: string }): ThunkAction<void, EditorState, unknown, AnyAction> => (dispatch, getState) => {
    if (!path) return;

    dispatch(divTreeSlice.actions.divUp({ path }));

    const { parentPath, index } = getPathParentAndIndex(path);
    const parent = selectDivByPath(parentPath)(getState());

    if (index < (parent?.children?.length || 0) - 1) {
        dispatch(setActivePath(
            (parentPath ? (parentPath + '-') : '') + (index + 1)
        ));
    }

};
export const divDown = ({ path }: { path: string }): ThunkAction<void, EditorState, unknown, AnyAction> => (dispatch, getState) => {
    if (!path) return;

    dispatch(divTreeSlice.actions.divDown({ path }));

    const { parentPath, index } = getPathParentAndIndex(path);
    const parent = selectDivByPath(parentPath)(getState());

    if (index > 0) {
        dispatch(setActivePath(
            (parentPath ? (parentPath + '-') : '') + (index - 1)
        ));
    }
};
