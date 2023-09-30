import { AnyAction, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit";
import {
    CollectableParameters,
    Div,
    DivBehaviourParameters,
    DivId,
    DivPositionParameters,
    DivStyleParameters, ReceivableCollectableParameters,
    ReceiverParameters,
    Tree,
} from "./types";
import { AppState } from "../../types";
import {
    addById,
    deleteById,
    getAllCollectableIds,
    getByIdWithParentAngle,
    getIdsPathById,
    getOrderPathById,
    updateById,
} from "../../../utils/tree";

import undoable from "redux-undo";
import { getInitialTreeState } from "./helpers/getInitialTreeState";
import { getInitialDivReceivableCollectableParameters } from "./helpers/getInitialDivReceivableCollectableParameters";

const initialState: Tree = getInitialTreeState();

export const treeSlice = createSlice({
    name: 'tree',
    initialState,
    reducers: {
        setTreeState: (state: Tree, action: PayloadAction<Tree>) => {
            return action.payload;
        },
        setActiveDiv: (state: Tree, action: PayloadAction<{ id: string, nohistory?: boolean }>) => {
            state.activeDivId = action.payload.id;
        },
        resetActiveDiv: (state: Tree) => {
            state.activeDivId = null;
        },
        updateDivStyleParameters: (state: Tree, action: PayloadAction<{ params: DivStyleParameters, id: string, nohistory?: boolean }>) => {
            const { id, params } = action.payload;
            state.div = updateById(state.div, id, (state: Div) => ({
                ...state,
                styleParameters: params
            }));
        },
        updateDivPositionParameters: (state: Tree, action: PayloadAction<{ params: DivPositionParameters, id: string, nohistory?: boolean }>) => {
            const { id, params } = action.payload;
            state.div = updateById(state.div, id, (state: Div) => ({
                ...state,
                positionParameters: params
            }));
        },
        updateDivBehaviourParameters: (state: Tree, action: PayloadAction<{ params: DivBehaviourParameters, id: string, nohistory?: boolean }>) => {
            const { id, params } = action.payload;
            state.div = updateById(state.div, id, (state: Div) => ({
                ...state,
                behaviourParameters: params
            }));
        },
        updateDivCollectableParameters: (state: Tree, action: PayloadAction<{ params: CollectableParameters, id: string, nohistory?: boolean }>) => {
            const { id, params } = action.payload;
            state.div = updateById(state.div, id, (state: Div) => ({
                ...state,
                behaviourParameters: {
                    ...state.behaviourParameters,
                    collectableParameters: params
                }
            }));
        },
        updateDivReceiverParameters: (state: Tree, action: PayloadAction<{ params: ReceiverParameters, id: string, nohistory?: boolean }>) => {
            const { id, params } = action.payload;
            state.div = updateById(state.div, id, (state: Div) => ({
                ...state,
                behaviourParameters: {
                    ...state.behaviourParameters,
                    receiverParameters: params
                }
            }));
        },
        updateDivReceivableCollectableParameters: (state: Tree, action: PayloadAction<{ params: ReceivableCollectableParameters | undefined, id: string, collectableId: string, nohistory?: boolean }>) => {
            const { id, collectableId, params } = action.payload;
            state.div = updateById(state.div, id, (state: Div) => ({
                ...state,
                behaviourParameters: {
                    ...state.behaviourParameters,
                    receiverParameters: {
                        ...state.behaviourParameters.receiverParameters,
                        receivableCollectablesParameters: {
                            ...state.behaviourParameters.receiverParameters.receivableCollectablesParameters,
                            [collectableId]: params
                        }
                    }
                }
            }));
        },
        setDivReceivableCollectableInitialParameters: (state: Tree, action: PayloadAction<{ id: string, collectableId: string, nohistory?: boolean }>) => {
            const { id, collectableId } = action.payload;
            state.div = updateById(state.div, id, (state: Div) => ({
                ...state,
                behaviourParameters: {
                    ...state.behaviourParameters,
                    receiverParameters: {
                        ...state.behaviourParameters.receiverParameters,
                        receivableCollectablesParameters: {
                            ...state.behaviourParameters.receiverParameters.receivableCollectablesParameters,
                            [collectableId]: getInitialDivReceivableCollectableParameters()
                        }
                    }
                }
            }));
        },
        deleteDiv: (state: Tree, action: PayloadAction<{ id: string }>) => {
            if (action.payload.id) {
                state.div = deleteById(state.div, action.payload.id);
            }
        },
        addChildren: (state: Tree, action: PayloadAction<{ divState: Omit<Div, 'id'>, id: string }>) => {
            const { id, divState } = action.payload;
            state.div = addById(state.div, id, divState);
        },
        divUp: (state: Tree, action: PayloadAction<{ id: string }>) => {

            const { id } = action.payload;

            const parentId = state.div[id]?.parent;

            if (parentId) {

                state.div = updateById(state.div, parentId, (parentElement: Div) => {
                    const index = parentElement.children.findIndex(childId => childId === id);
                    if (index < parentElement.children.length - 1) {
                        const newChildren = [...parentElement.children];
                        const temp = newChildren[index + 1];
                        newChildren[index + 1] = newChildren[index];
                        newChildren[index] = temp;

                        return {
                            ...parentElement,
                            children: newChildren,
                        };
                    } else {
                        return parentElement;
                    }
                });
            }
        },
        divDown: (state: Tree, action: PayloadAction<{ id: string }>) => {

            const { id } = action.payload;

            const parentId = state.div[id]?.parent;

            if (parentId) {

                state.div = updateById(state.div, parentId, (parentElement: Div) => {
                    const index = parentElement.children.findIndex(childId => childId === id);
                    if (index > 0) {
                        const newChildren = [...parentElement.children];
                        const temp = newChildren[index - 1];
                        newChildren[index - 1] = newChildren[index];
                        newChildren[index] = temp;

                        return {
                            ...parentElement,
                            children: newChildren,
                        };
                    } else {
                        return parentElement;
                    }
                });
            }
        },
    },
});

export const selectTreeRootId = (state: AppState): string => state.currentProject.tree.present.rootDivId;
export const selectTreeRoot = (state: AppState): Div | undefined => state.currentProject.tree.present.div[state.currentProject.tree.present.rootDivId];
export const selectDivById = (id: string) => (state: AppState): Div => {
    const div = state.currentProject.tree.present.div[id];

    if (!div) {
        throw new Error('div with id=' + id + ' not found');
    }

    return div;
};
export const selectParentDivById = (id: string) => (state: AppState): Div | undefined => state.currentProject.tree.present.div[state.currentProject.tree.present.div[id]?.parent as string];
export const selectDivByIdWithParentAngle = (id: string) => (state: AppState) => getByIdWithParentAngle(state.currentProject.tree.present.div, id);
export const selectCollectableIds = (state: AppState) => getAllCollectableIds(state.currentProject.tree.present.div);
export const selectIdsPathById = (id: string) => (state: AppState): DivId[] => getIdsPathById(state.currentProject.tree.present.div, id);
export const selectOrderPathById = (id: string) => (state: AppState): string => getOrderPathById(state.currentProject.tree.present.div, id);
export const selectActiveDivId = (state: AppState) => state.currentProject.tree.present.activeDivId;
export const selectReceivableCollectableParams = (id: string, collectableId: string) => (state: AppState) => {
    console.log(666, selectDivById(id)(state).behaviourParameters.receiverParameters.receivableCollectablesParameters)
    return selectDivById(id)(state).behaviourParameters.receiverParameters.receivableCollectablesParameters[collectableId]
};

export const {
    updateDivStyleParameters,
    updateDivPositionParameters,
    updateDivBehaviourParameters,
    updateDivCollectableParameters,
    updateDivReceiverParameters,
    updateDivReceivableCollectableParameters,
    setDivReceivableCollectableInitialParameters,
    addChildren,
    setTreeState,
} = treeSlice.actions;

export const setActiveDiv = (id: string): ThunkAction<void, AppState, unknown, AnyAction> => (dispatch, getState) => {
    dispatch(treeSlice.actions.setActiveDiv({ id, nohistory: true }));
};

export const deleteDiv = ({ id }: { id: string }): ThunkAction<void, AppState, unknown, AnyAction> => (dispatch, getState) => {
    const beforeDeleteState = getState();
    const deletedElement = beforeDeleteState.currentProject.tree.present.div[id];

    if (!deletedElement) {
        throw new Error('element id=' + id + ' not found');
    }

    const parentId = deletedElement.parent;

    if (!parentId) {
        throw new Error('cant delete root element id=' + id);
    }

    const parentElement = beforeDeleteState.currentProject.tree.present.div[parentId];

    if (!parentElement) {
        throw new Error('parent of ' + id + ' (' + parentId + ') not found');
    }

    const childIndex = parentElement.children.indexOf(id);

    dispatch(treeSlice.actions.deleteDiv({ id }));

    const afterDeleteState = getState();
    const newParentElement = afterDeleteState.currentProject.tree.present.div[parentId];

    if (!newParentElement) {
        throw new Error('parent of ' + id + ' (' + parentId + ') not found');
    }

    if (childIndex < newParentElement.children.length) {
        dispatch(setActiveDiv(newParentElement.children[childIndex]));

    } else if (newParentElement.children.length) {
        dispatch(setActiveDiv(newParentElement.children[newParentElement.children.length - 1]));

    } else {
        dispatch(setActiveDiv(parentId));
    }
};

export const divUp = ({ id }: { id: string }): ThunkAction<void, AppState, unknown, AnyAction> =>
    (dispatch, getState) => {

        dispatch(treeSlice.actions.divUp({ id }));
    };

export const divDown = ({ id }: { id: string }): ThunkAction<void, AppState, unknown, AnyAction> =>
    (dispatch, getState) => {

        dispatch(treeSlice.actions.divDown({ id }));
    };

export const treeSliceUndoableReducer = undoable(treeSlice.reducer, {
    limit: 10,
    filter: action => !action.payload.nohistory
});
