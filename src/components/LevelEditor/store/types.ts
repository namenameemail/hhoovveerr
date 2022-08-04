import { DivTreeState } from "./divTree/types";
import { GameParams } from "./gameParams/types";
import { EditorParams } from "./editorParams/types";

export interface EditorState {
    divTree: DivTreeState
    gameParams: GameParams
    editorParams: EditorParams
}