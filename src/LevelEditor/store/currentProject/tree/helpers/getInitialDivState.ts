import { defaultDivStyleParameters } from "../consts";
import { Div, InteractionEvent, SizeUnit, Vec2NumberUnit } from "../types";

export const getInitialDivState = (): Omit<Div, 'id'> => {
    return {
        positionParameters: {
            startPoint: [[0, SizeUnit.pc], [0, SizeUnit.pc]] as Vec2NumberUnit,
            size: [[100, SizeUnit.pc], [100, SizeUnit.pc]] as Vec2NumberUnit,
            angle: 0,
        },
        styleParameters: {
            ...defaultDivStyleParameters,
            color: 'white',
        },
        behaviourParameters: {
            openEvent: InteractionEvent.mouseEnter,
            closeEvent: InteractionEvent.mouseLeave,
            isCollectable: false,
            collectableParameters: {
                inventorySize: [[100, SizeUnit.px], [100, SizeUnit.px]] as Vec2NumberUnit,
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
    };
};
