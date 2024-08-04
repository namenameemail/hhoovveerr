import { RefCallback, MutableRefObject, useCallback, useEffect, useRef, useState } from "react";

import { DivStyles, getStyles } from "../helpers/configureStyles";
import {
    DivBehaviorParameters,
    DivPositionParameters,
    DivStyleParameters,
    Vec
} from "../../../store/currentProject/tree/types";
import { useEditorSelector } from "../../../store";
import { selectFonts, selectImages } from "../../../store/currentProject/assets";
import { selectTreeRootId } from "../../../store/currentProject/tree";
import { useDivRefContext } from "../../Preview/context/DivRefContext";

export const useDivStyles = (positionParameters: DivPositionParameters, styleParameters: DivStyleParameters, behaviorParameters: DivBehaviorParameters, isRoot?: boolean, isInventoryItem?: boolean): DivStyles | null => {

    const rootId = useEditorSelector(selectTreeRootId);
    const images = useEditorSelector(selectImages);
    const fonts = useEditorSelector(selectFonts);
    const { refService } = useDivRefContext();
    const getRootSize = refService.getDivSizeById(rootId);


    const [divStyles, setDivStyles] = useState<DivStyles | null>(null);

    const resizeHandler = useCallback(() => {

        const rootSize: Vec = getRootSize();

        setDivStyles(getStyles({
            styleParameters,
            positionParameters,
            behaviorParameters,

            isBlendActive: true,
            images,
            fonts,
            rootSize,
            isRoot,
            isInventoryItem
        }));
    }, [styleParameters, positionParameters,
        behaviorParameters, images, isRoot, isInventoryItem]);

    useEffect(() => {

        resizeHandler();

        window.addEventListener('resize', resizeHandler);

        return () => {

            window.removeEventListener('resize', resizeHandler);
        };
    }, [resizeHandler]);

    return divStyles;
};