import { defaultDivStyleParameters } from "../consts";
import { Div, InteractionEvent, ReceivableCollectableParameters, SizeUnit, Vec2NumberUnit } from "../types";

export const getInitialDivReceivableCollectableParameters = (): ReceivableCollectableParameters => {
    return {
        startPoint: [[10, SizeUnit.pc], [10, SizeUnit.pc]] as Vec2NumberUnit,
        size: [[80, SizeUnit.pc], [80, SizeUnit.pc]] as Vec2NumberUnit,
        angle: 0,
    };
};
