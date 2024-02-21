import {
    CSSProperties,
    HTMLProps,
    ReactNode,
    useCallback,
    useMemo,
    useState,
    MouseEvent,
    forwardRef,
    useImperativeHandle, useRef, RefObject
} from "react";
import cn from 'classnames';
import { DivId, InteractionEvent } from "../../LevelEditor/store/currentProject/tree/types";

export interface DivHoverProps extends Omit<HTMLProps<HTMLDivElement>, 'color' | 'onClick'> {
    open?: boolean;
    classNames?: string[];
    width?: number;
    height?: number;
    absolute?: boolean;
    relative?: boolean;
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
    background?: string;
    children?: ReactNode;
    openEvent?: InteractionEvent;
    closeEvent?: InteractionEvent;
    collectEvent?: InteractionEvent;
    receiveEvent?: InteractionEvent;
    onCollect?: (id: DivId, sourceReceiverId?: DivId) => void;
    isReceiving?: boolean;
    onReceive?: (receiverId: DivId) => void;
    onClick?: (id: string) => void;
    stopClickPropagation?: boolean

    id: string
    path?: string
}

export interface DivHoverInterface {
    divRef: RefObject<HTMLDivElement>
}

// export const DivHover = forwardRef<DivHoverInterface, DivHoverProps>(function(props: DivHoverProps, ref) {
export const DivHover = (function(props: DivHoverProps) {

    const {
        path, id,

        stopClickPropagation,

        open,
        children,
        classNames,

        width,
        height,
        absolute,
        relative,
        top,
        left,
        right,
        bottom,
        background,
        openEvent,
        closeEvent,
        collectEvent,
        receiveEvent,
        onCollect,
        isReceiving,
        onReceive,
        onClick,

        style: propsStyle,

        ...restProps
    } = props;

    const style: CSSProperties = useMemo(() => ({
        width,
        height,
        position: (absolute && 'absolute') || (relative && 'relative') || undefined,
        top,
        left,
        right,
        bottom,
        background,
        ...propsStyle,
    }), [width, height, absolute, relative, top, left, right, bottom, background, propsStyle]);

    const [isIn, setIsIn] = useState(false);

    const interactionHandler = useCallback((interactionEvent: InteractionEvent) => {
        // console.log(444, interactionEvent, openEvent, openEvent === interactionEvent)
        if (openEvent === interactionEvent) {
            setIsIn(true);
        }
        if (closeEvent === interactionEvent) {
            setIsIn(false);
        }
        if (collectEvent === interactionEvent) {
            onCollect?.(id);
        }
        if (isReceiving && receiveEvent === interactionEvent) {
            onReceive?.(id);
        }
    }, [openEvent, closeEvent, collectEvent, receiveEvent, isReceiving, onReceive, onCollect, id]);

    const handleMouseEnter = useCallback(() => {
        interactionHandler(InteractionEvent.mouseEnter);
    }, [interactionHandler]);

    const handleMouseleave = useCallback(() => {
        interactionHandler(InteractionEvent.mouseLeave);
    }, [interactionHandler]);

    // console.log(333, isIn)
    const handleClick = useCallback((e: MouseEvent) => {
        stopClickPropagation && e.stopPropagation();
        // console.log(33, path, closeEvent === InteractionEvent.click && openEvent === InteractionEvent.click, isIn)
        // console.log(33, path, closeEvent === InteractionEvent.click,openEvent === InteractionEvent.click, isIn)
        if (closeEvent === InteractionEvent.click && openEvent === InteractionEvent.click) {

            setIsIn(isIn => !isIn);
        } else {
            if (openEvent === InteractionEvent.click) {
                if (!isIn) {
                    setIsIn(true);
                }
            }
            if (closeEvent === InteractionEvent.click) {
                if (isIn) {
                    setIsIn(false);
                }
            }
        }
        if (collectEvent === InteractionEvent.click) {
            onCollect?.(id);
        }

        if (isReceiving && receiveEvent === InteractionEvent.click) {
            onReceive?.(id);
        }

        onClick?.(id);
    }, [id, stopClickPropagation, isIn, openEvent, closeEvent, collectEvent, onCollect, id, onClick, receiveEvent, isReceiving, onReceive]);

    const handleDoubleClick = useCallback((e: MouseEvent) => {
        stopClickPropagation && e.stopPropagation();
        // console.log(33, path, closeEvent === InteractionEvent.doubleClick,openEvent === InteractionEvent.doubleClick, isIn)
        if (closeEvent === InteractionEvent.doubleClick && openEvent === InteractionEvent.doubleClick) {

            setIsIn(isIn => !isIn);
        } else {
            if (openEvent === InteractionEvent.doubleClick) {
                if (!isIn) {
                    setIsIn(true);
                }
            }
            if (closeEvent === InteractionEvent.doubleClick) {
                if (isIn) {
                    setIsIn(false);
                }
            }
        }
        if (collectEvent === InteractionEvent.doubleClick) {
            onCollect?.(id);
        }

        if (isReceiving && receiveEvent === InteractionEvent.doubleClick) {
            onReceive?.(id);
        }
    }, [stopClickPropagation, path, interactionHandler, isIn, openEvent, closeEvent, collectEvent, onCollect, id, receiveEvent, isReceiving, onReceive]);


    return (
        <div
            {...restProps}
            style={style}
            className={cn(classNames)}

            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseleave}
        >
            {isIn || open ? children : null}
            {/*{true ? children : null}*/}
        </div>
    );
})

