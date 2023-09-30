import { NumberUnit, SizeUnit, Vec2NumberUnit } from "../store/currentProject/tree/types";

export const getNumberUnitCssValue = (value?: NumberUnit, defaultUnit: string = SizeUnit.px) => {
    return [value?.[0] || 0, value?.[1] || defaultUnit].join('')
}
export const getVec2NumberUnitCssValue = (value: Vec2NumberUnit, defaultUnit: string, separator: string = ' ') => {
    return value.map(value => getNumberUnitCssValue(value, defaultUnit)).join(separator)
}