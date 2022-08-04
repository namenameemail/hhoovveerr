import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DivParameters, DivState, DivTreeState } from "./types";
import { EditorState } from "../types";
import { PATH_SPLITTER } from "./consts";

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
    activePath: ''
};

const updateByPath = (root: DivState, pathString: string, update: (state: DivState) => DivState) => {

    const path = pathString ?
        pathString.split(PATH_SPLITTER)
            .map(index => +index) :
        [];

    if (!path.length) {
        return update(root);
    }

    const iteration = (node: DivState, i: number = 0) => {
        const newNode = {
            ...node,
            children: [...node.children]
        };

        if (i < path.length - 1) {
            newNode.children[path[i]] = iteration(newNode.children[path[i]], ++i);
        } else {
            newNode.children[path[i]] = update(newNode.children[path[i]]);
        }

        return newNode;
    };

    return iteration(root);
};

const deleteByPath = (root: DivState, pathString: string) => {
    const path = pathString
        .split(PATH_SPLITTER)
        .map(index => +index);

    const iteration = (node: DivState, i: number = 0): DivState => {
        const newNode: DivState = {
            ...node,
            children: [...node.children]
        };

        if (i < path.length - 1) {
            newNode.children[path[i]] = iteration(newNode.children[path[i]], ++i);
        } else {
            newNode.children.splice(path[i], 1);
        }

        return newNode;
    };

    return iteration(root);
};
const addByPath = (root: DivState, pathString: string, state: DivState): DivState => {
    const path = pathString
        ? pathString.split(PATH_SPLITTER).map(index => +index)
        : [];

    const iteration = (node: DivState, i: number = 0): DivState => {
        const newNode: DivState = {
            ...node,
            children: [...node.children]
        };

        if (i <= path.length - 1) {
            newNode.children[path[i]] = iteration(newNode.children[path[i]], ++i);
        } else {
            newNode.children.push(state);
        }

        return newNode;


    };

    return iteration(root);
};

export const divTreeSlice = createSlice({
    name: 'divTree',
    initialState,
    reducers: {
        setRoot: (state: DivTreeState, action: PayloadAction<DivState>) => {
            state.root = action.payload;
        },
        setActivePath: (state: DivTreeState, action: PayloadAction<string>) => {
            state.activePath = action.payload;
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
        updateDiv: (state: DivTreeState, action: PayloadAction<{ divState: DivState, path: string }>) => {
            const { path, divState } = action.payload;
            console.log(path);
            state.root = updateByPath(state.root, path, () => divState);
        },
        updateDivParameters: (state: DivTreeState, action: PayloadAction<{ divParams: DivParameters, path: string }>) => {
            const { path, divParams } = action.payload;
            console.log(path);
            state.root = updateByPath(state.root, path, (state: DivState) => ({
                ...state,
                parameters: divParams
            }));
        },
        deleteDiv: (state: DivTreeState, action: PayloadAction<{ path: string }>) => {
            state.root = deleteByPath(state.root, action.payload.path);
        },
        addChildren: (state: DivTreeState, action: PayloadAction<{ divState: DivState, path: string }>) => {
            const { path, divState } = action.payload;
            state.root = addByPath(state.root, path, divState);
        },
    },
});

export const {
    setRoot,
    setActivePath,
    changeColor,
    updateDiv,
    updateDivParameters,
    addChildren,
    deleteDiv,
} = divTreeSlice.actions;

// export const

export const selectDivTreeRoot = (state: EditorState) => state.divTree.root;
export const selectDivTreeActivePath = (state: EditorState) => state.divTree.activePath;
