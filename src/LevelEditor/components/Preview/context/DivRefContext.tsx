import {
    Context,
    createContext,
    PropsWithChildren, RefObject,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { DivId } from "../../../store/currentProject/tree/types";
import { DivRefService } from "../../../services/divRefService";

export type DivRefContextValue = {
    refService: RefObject<DivRefService>

}

export const DivRefContext = createContext<DivRefContextValue | null>(null);

export type DivRefProviderProps = {}

export function DivRefProvider(props: PropsWithChildren<DivRefProviderProps>) {
    const refService = useRef<DivRefService | null>(null);

    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        refService.current = new DivRefService()
        setIsActive(true)
    }, [])

    const { children } = props;

    const value = useMemo(() => ({
        refService
    }), [refService]);

    return (
        <DivRefContext.Provider value={value}>{isActive ? children : null}</DivRefContext.Provider>
    );
}

export function useDivRefContext(): DivRefContextValue {


    return useContext(DivRefContext) as DivRefContextValue;
    // делаем приведение типа потому что выше сделано так,
    // что потомки не рендерятся пока не создастся контекст
    // чтобы не пришлось делать проерки на наличие контекста
}
