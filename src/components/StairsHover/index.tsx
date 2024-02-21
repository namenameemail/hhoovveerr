import { DivHover, DivHoverProps } from "../DivHover/DivHover";
import { renderRecursionHOC } from "../../hoc/renderRecursionHOC";

export const StairsHover = renderRecursionHOC<DivHoverProps>(5, DivHover);
