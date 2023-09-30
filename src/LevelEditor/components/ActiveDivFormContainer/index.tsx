import cn from 'classnames';
import { DivForm } from "../DivForm/DivForm";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useEditorSelector } from "../../store";
import { KeyboardJSTrigger } from "bbuutoonnss";
import { Vec } from "../../store/currentProject/tree/types";
import { selectActiveDivId } from "../../store/currentProject/tree";

export interface ActiveDivFormContainerProps {
    className?: string;
}

export function ActiveDivFormContainer(props: ActiveDivFormContainerProps) {

    const { className } = props;

    const activeElementId = useEditorSelector(selectActiveDivId);

    const [isOpen, setIsOpen] = useState<null | Vec>(null);
    const [isIn, setIsIn] = useState<boolean>(false);
    const [isPressed, setIsPressed] = useState<boolean>(false);
    const pos = useRef<Vec>([0, 0]);
    const timer = useRef<number | undefined>(undefined);

    const moveHandler = useCallback((e: MouseEvent) => {
        pos.current = [e.clientX, e.clientY];
    }, [pos]);

    useEffect(() => {
        document.addEventListener('mousemove', moveHandler);
        return () => {
            document.removeEventListener('mousemove', moveHandler);
        };
    }, [moveHandler]);


    const startTimer = useCallback(() => {
        console.log('start');

        if (timer.current) {
            clearTimeout(timer.current);
        }

        timer.current = window.setTimeout(() => {
            setIsOpen(null);
        }, 0);

    }, [timer]);

    const stopTimer = useCallback(() => {

        console.log('stop', timer.current);
        clearTimeout(timer.current);

    }, [timer]);

    const handleMouseEnter = useCallback(() => {
        console.log('enter');
        setIsIn(true);
        // stopTimer();
    }, [stopTimer]);

    const handleMouseOut = useCallback(() => {
        console.log('out',);
        setIsIn(false);
        // !isPressed && startTimer();
    }, [startTimer, isPressed]);

    const handlePress = useCallback(() => {
        setIsPressed(true);
        setIsOpen(isOpen ? null : pos.current);
    }, [stopTimer, pos, isOpen]);
    const handleRelease = useCallback(() => {
        setIsPressed(false);
        // !isIn && startTimer();
    }, [startTimer, isIn]);
    //
    // useHotkeys([
    //     ['M', () => {
    //         setIsOpen(pos.current);
    //         startTimer()
    //     }],
    // ]);

    return (
        <div
            className={cn(className)}
            style={{
                border: '1px solid red',
                position: 'fixed',
                left: (isOpen?.[0] || 0),// + 10,
                top: (isOpen?.[1] || 0),// + 10,
                visibility: isOpen ? 'visible' : 'hidden'
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseOut}
        >
            <KeyboardJSTrigger keyValue={'M'} onPress={handlePress} onRelease={handleRelease}/>
            <KeyboardJSTrigger keyValue={'m'} onPress={handlePress} onRelease={handleRelease}/>
            {activeElementId && (
                <DivForm id={activeElementId}/>
            )}
        </div>
    );
}

