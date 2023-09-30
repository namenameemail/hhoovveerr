import { InteractionEvent, SizeUnit } from "../store/currentProject/tree/types";

export const blendModes = [
    'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
    'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference',
    'exclusion', 'hue', 'saturation', 'color', 'luminosity',
];
export const borderTypes = ['solid', 'dashed', 'dotted', 'double', 'hidden'];

export const sizeUnits = Object.values(SizeUnit)

export const interactionEvent = Object.values(InteractionEvent)