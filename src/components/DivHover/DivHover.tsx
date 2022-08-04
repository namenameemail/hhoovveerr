import { useCallback, useState, HTMLProps, CSSProperties, useMemo, ReactNode } from "react";
import cn from 'classnames';

export interface DivHoverProps extends Omit<HTMLProps<HTMLDivElement>, 'color'> {
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
}

export function DivHover(props: DivHoverProps) {

    const {
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

    const handleMouseEnter = useCallback(() => {
        setIsIn(true);
    }, []);

    const handleMouseleave = useCallback(() => {
        setIsIn(false);
    }, []);

    return (
        <div
            {...restProps}
            style={style}
            className={cn(classNames)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseleave}
        >
            {isIn || open ? children : null}
            {/*{true ? children : null}*/}
        </div>
    );
}

