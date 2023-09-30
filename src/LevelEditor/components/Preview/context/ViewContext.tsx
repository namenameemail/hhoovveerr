import { Context, createContext, PropsWithChildren, useCallback, useContext, useMemo, useRef, useState } from "react";
import { DivId } from "../../../store/currentProject/tree/types";
import { DivRefService } from "../../../services/divRefService";

export type ViewContextState = {
    received: {
        [id: string]: DivId[] // received
    },
    collected: DivId[] // collected
    currentActiveCollectableId: DivId | null
}
export type ViewContextValue = {
    state: ViewContextState
    onCollect: (id: DivId, sourceReceiverId?: DivId) => void
    onReceive: (receiverId: DivId) => void
    onSetActiveCollectable: (id: DivId) => void

}

export const ViewContext = createContext<ViewContextValue | null>(null);

export type ViewProviderProps = {}

const initialState = {
    received: {},
    collected: [],
    currentActiveCollectableId: null
};

export function ViewProvider(props: PropsWithChildren<ViewProviderProps>) {
    const refService = useRef(new DivRefService());

    const { children } = props;

    const [state, setState] = useState<ViewContextState>(initialState);

    const onCollect = useCallback((id: DivId, sourceReceiverId?: DivId) => {
        setState(state => ({
            ...state,
            collected: [...state.collected, id],
            ...(sourceReceiverId ? {
                received: {
                    ...state.received,
                    [sourceReceiverId]: state.received[sourceReceiverId].filter(receivedId => receivedId !== id)
                }
            } : {})
        }));
    }, []);

    const onReceive = useCallback((receiverSource: DivId) => {
        setState(state => {
            if (state.currentActiveCollectableId) {
                return {
                    ...state,
                    collected: state.collected.filter(collectedId => collectedId !== state.currentActiveCollectableId),
                    received: {
                        ...state.received,
                        [receiverSource]: [...state.received[receiverSource], state.currentActiveCollectableId]
                    }
                };
            } else {
                return state;
            }
        });
    }, []);

    const onSetActiveCollectable = useCallback((id: DivId) => {
        setState(state => ({
            ...state,
            currentActiveCollectableId: id
        }));
    }, []);

    const value = useMemo(() => ({
        state,
        onCollect,
        onReceive,
        onSetActiveCollectable,
        refService
    }), [refService, onCollect, onReceive, state]);

    return (
        <ViewContext.Provider value={value}>{children}</ViewContext.Provider>
    );
}

export function useViewContext(): (ViewContextValue | {}) & { isActive: boolean } {

    const context = useContext<ViewContextValue>(
        (ViewContext as unknown) as Context<ViewContextValue>
    );

    if (!context) {
        return {
            isActive: false
        };
    }

    return { ...context, isActive: true };
}
