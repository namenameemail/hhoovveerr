import { InteractionEvent, NumberUnit, SizeUnit, Vec2NumberUnit } from "./types";

export const PATH_SPLITTER = '-'


export const defaultDivStyleParameters = {
    fontSize: [14, SizeUnit.px] as NumberUnit,
    openEvent: InteractionEvent.mouseEnter,
    closeEvent: InteractionEvent.mouseLeave,
    collectEvent: InteractionEvent.click,
    inventorySize: [[100, SizeUnit.px], [100, SizeUnit.px]] as Vec2NumberUnit
}