import { RefCallback, MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
// import { getDivSizeById, refService } from "../refService";
import { DivStyles, getStyles } from "../helpers/configureStyles";
import {
    DivBehaviourParameters,
    DivPositionParameters,
    DivStyleParameters,
    Vec
} from "../../../store/currentProject/tree/types";
import { useEditorSelector } from "../../../store";
import { selectFonts, selectImages } from "../../../store/currentProject/assets";
import { selectTreeRootId } from "../../../store/currentProject/tree";
import { useDivRefContext } from "../../Preview/context/DivRefContext";

export const useDivStyles = (positionParameters: DivPositionParameters, styleParameters: DivStyleParameters, behaviourParameters: DivBehaviourParameters, isRoot?: boolean, isInventoryItem?: boolean): DivStyles | null => {

    const rootId = useEditorSelector(selectTreeRootId);
    const images = useEditorSelector(selectImages);
    const fonts = useEditorSelector(selectFonts);
    const divRefContext = useDivRefContext();
    const { refService: { current: refService } } = divRefContext;
    const getRootSize = refService?.getDivSizeById(rootId) as () => Vec;


    const [divStyles, setDivStyles] = useState<DivStyles | null>(null);

    const resizeHandler = useCallback(() => {

        const rootSize: Vec = getRootSize();

        setDivStyles(getStyles({
            styleParameters,
            positionParameters,
            behaviourParameters,

            isBlendActive: true,
            images,
            fonts,
            rootSize,
            isRoot,
            isInventoryItem
        }));
    }, [styleParameters, positionParameters,
        behaviourParameters, images, isRoot, isInventoryItem]);

    useEffect(() => {

        resizeHandler();

        window.addEventListener('resize', resizeHandler);

        return () => {

            window.removeEventListener('resize', resizeHandler);
        };
    }, [resizeHandler]);

    return divStyles;
};