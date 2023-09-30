import styles from './styles.module.css';
import cn from 'classnames';
import React, { useCallback } from "react";
import { useEditorDispatch, useEditorSelector } from "../../../../store";
import {
    deleteDiv,
    divDown,
    divUp,
    selectTreeRoot,
    selectTreeRootId,
    selectIdsPathById, selectActiveDivId
} from "../../../../store/currentProject/tree";
import { selectGameParams } from "../../../../store/currentProject/gameParams";
import { selectEditorParams, setEditorParams } from "../../../../store/currentProject/editorParams";
import { useHotkeys } from "@mantine/hooks";
import { ActionCreators } from "redux-undo";
import { BlurEnterNumberInputFor, CheckboxFor, For } from "../../../../../components/For";
import { EditorParams } from "../../../../store/currentProject/editorParams/types";
import { ImageBrowser } from "../../../ImageBrowser";
import { FontBrowser } from "../../../FontBrowser";
import { Export } from "../../../Export";
import { RegimeSelect } from "../../../RegimeSelect";
import { EditDiv } from "../../../EditDiv";
import { ViewDiv } from "../../../ViewDiv";
import { DivForm } from "../../../DivForm/DivForm";
import { DivTree } from "../../../DivTree";
import { ActiveDivFormContainer } from "../../../ActiveDivFormContainer";
import { saveCurrentProject, setProjectManagerOpen } from "../../../../store/projectsManager";
import { Preview } from "../../../Preview";
import { EditorCanvas } from "../../../EditorCanvas";

export interface TreeRegimeProps {
    className?: string;
}

export function TemplateRegime(props: TreeRegimeProps) {


    const activeElementId = useEditorSelector(selectActiveDivId);
    const activePath = useEditorSelector(selectIdsPathById(activeElementId as string));
    const rootId = useEditorSelector(selectTreeRootId);
    const root = useEditorSelector(selectTreeRoot);
    const gameParams = useEditorSelector(selectGameParams);
    const editorParams = useEditorSelector(selectEditorParams);
    const dispatch = useEditorDispatch();

    // console.log(activePath);

    useHotkeys([
        ['mod+S', () => dispatch(saveCurrentProject())],
        ['mod+X', () => console.log('cut')],
        ['mod+V', () => console.log('paste')],
        ['mod+C', () => console.log('copy')],
        ['I', () => dispatch(setEditorParams({ ...editorParams, showInactivePath: !editorParams.showInactivePath }))],
        ['P', () => dispatch(setEditorParams({ ...editorParams, view: !editorParams.view }))],
        ['O', () => dispatch(setEditorParams({ ...editorParams, openActivePath: !editorParams.openActivePath }))],
        ['ArrowUp', () => activeElementId && dispatch(divUp({ id: activeElementId }))],
        ['ArrowDown', () => activeElementId && dispatch(divDown({ id: activeElementId }))],
        ['mod+Z', () => dispatch(ActionCreators.undo())],
        ['mod+shift+Z', () => dispatch(ActionCreators.redo())],
        ['Backspace', () => activeElementId && dispatch(deleteDiv({ id: activeElementId }))],
    ]);

    return (
        <div
            className={cn(styles.levelEditor)}
        >
            <div className={styles.firstRow}>
                <div className={styles.firstRowLeft}>

                    <div className={styles.block}>
                        <button onClick={() => dispatch(saveCurrentProject())}>save</button>
                        <button onClick={() => dispatch(setProjectManagerOpen(true))}>open...</button>
                    </div>
                    <div className={styles.block}>
                        <For<EditorParams>
                            className={styles.gameParamsForm}
                            value={editorParams}
                            onChange={(value: EditorParams) => dispatch(setEditorParams(value))}
                        >
                            <CheckboxFor name="showInactivePath" text="show inactive path [i]"/>

                            <BlurEnterNumberInputFor
                                className={styles.opacity}
                                name="inactivePathOpacity"
                                placeholder={'inactive path opacity'}
                                title={'inactive path opacity'}
                            />

                        </For>
                    </div>
                    <div className={styles.block}>
                        <For<EditorParams>
                            className={styles.gameParamsForm}
                            value={editorParams}
                            onChange={(value: EditorParams) => dispatch(setEditorParams(value))}
                        >
                            <CheckboxFor name="view" text={'preview [p]'}/>
                            <CheckboxFor name="openActivePath" text="open active path [o]"/>
                        </For>
                    </div>
                    <div className={styles.block}>
                        <ImageBrowser/>
                        <FontBrowser/>
                    </div>
                    <div className={styles.block}>
                        <Export/>
                    </div>
                </div>
                <div className={styles.firstRowRight}>
                    {/*<Brushes/>*/}
                    <RegimeSelect/>
                </div>
            </div>
            <div className={styles.secondRow}>
                <div className={styles.editorViewport}>
                    <EditorCanvas/>
                    {/*<EditDiv*/}
                    {/*    id={rootId}*/}
                    {/*    isRoot*/}
                    {/*    className={cn({ [styles.hidden]: editorParams.view })}*/}
                    {/*    getParentSize={getDivSizeById(rootId)}*/}
                    {/*    activePath={activePath}*/}
                    {/*/>*/}

                    {editorParams.view && (
                        <div className={styles.view}>
                            <Preview/>
                        </div>
                    )}

                </div>
                <div className={styles.rightColumn}>

                    <DivForm className={styles.divForm} id={activeElementId || rootId}/>
                    <DivTree className={styles.divTree}/>
                </div>

                <ActiveDivFormContainer/>
            </div>
        </div>
    );
}

