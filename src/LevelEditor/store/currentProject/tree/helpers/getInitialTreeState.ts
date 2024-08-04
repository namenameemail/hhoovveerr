import { v4 as uuid } from "uuid";
import { defaultDivStyleParameters } from "../consts";
import { InteractionEvent, SizeUnit, Tree, Vec2NumberUnit } from "../types";

export const getInitialTreeState = (): Tree => {
    const rootDivId = uuid();

    return {
        rootDivId,
        activeDivId: null,
        div: {
            [rootDivId]: {
                id: rootDivId,
                positionParameters: {
                    startPoint: [[0, SizeUnit.pc], [0, SizeUnit.pc]] as Vec2NumberUnit,
                    size: [[100, SizeUnit.pc], [100, SizeUnit.pc]] as Vec2NumberUnit,
                    angle: 0,
                },
                styleParameters: {
                    ...defaultDivStyleParameters,
                    color: 'white',
                },
                behaviorParameters: {
                    openEvent: InteractionEvent.mouseEnter,
                    closeEvent: InteractionEvent.mouseLeave,
                    isCollectable: false,
                    collectableParameters: {
                        inventorySize: [[100, SizeUnit.pc], [100, SizeUnit.pc]] as Vec2NumberUnit,
                        collectEvent: InteractionEvent.click,
                    },
                    isReceiver: false,
                    receiverParameters: {
                        receiveEvent: InteractionEvent.click,
                        receivableCollectables: [],
                        receivableCollectablesParameters: {}
                    },
                    isTemplate: false,
                    templateParameters: {},
                },
                children: [],
            },
        },
    };
};
