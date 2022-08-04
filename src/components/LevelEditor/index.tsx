import styles from './styles.module.css';
import { useKeydown } from 'bbuutoonnss';
import React, { CSSProperties, useMemo } from "react";
import { EditDiv } from "./components/EditDiv";
import { Provider as StoreProvider, useDispatch, useSelector } from 'react-redux';
import { store } from './store';
import { deleteDiv, selectDivTreeActivePath, selectDivTreeRoot } from "./store/divTree";
import { selectGameParams, setGameParams } from "./store/gameParams";
import { BorderParams, GameParams, Layout } from "./store/gameParams/types";
import { BlurEnterNumberInputFor, BlurEnterTextInputFor, CheckboxFor, For, ObjectFor, SelectDropFor } from "../For";
import cn from "classnames";
import { EditorParams } from "./store/editorParams/types";
import { selectEditorParams, setEditorParams } from "./store/editorParams";
import { DivTree } from "./components/DivTree";
import { ViewDiv } from "./components/ViewDiv";

export interface LevelEditorProps {

}

export const LevelEditor = (function (LevelEditor: React.ComponentType<LevelEditorProps>) {
    return (props: LevelEditorProps) => (
        <StoreProvider store={store}>
            <LevelEditor {...props}/>
        </StoreProvider>
    );
})(function (props: LevelEditorProps) {

    const activePath = useSelector(selectDivTreeActivePath);
    const root = useSelector(selectDivTreeRoot);
    const gameParams = useSelector(selectGameParams);
    const editorParams = useSelector(selectEditorParams);
    const dispatch = useDispatch();

    // console.log(activePath);

    useKeydown((event: KeyboardEvent) => {
        if (event.key == "Backspace") {
            console.log("Backspace Pressed");

            // dispatch(deleteDiv({ path: activePath }));
            // dispatch(set)
            //
            // setChildren(path.reduce((res, i,  index) => {
            //     res[i] =
            // }, children))

        }
    }, [activePath]);

    const backgroundStyle = useMemo<CSSProperties>(() => ({
        background: gameParams.background
    }), [gameParams]);

    const gameStyle = useMemo<CSSProperties>(() => ({
        background: gameParams.background,
    }), [gameParams]);

    // console.log('LE', root.children.length)

    return (
        <div
            className={cn(styles.levelEditor, {
                [styles.center]: gameParams.layout === Layout.Center,
                [styles.topLeft]: gameParams.layout === Layout.TopLeft,
            })}
            style={backgroundStyle}
        >

            {editorParams.view ? (
                <ViewDiv isRoot state={root}/>
            ) : (
                <EditDiv isRoot state={root}/>
            )}

            <div className={styles.rightColumn}>
                <DivTree/>
            </div>
            <div className={styles.leftColumn}>
                <For<GameParams>
                    className={styles.gameParamsForm}
                    value={gameParams}
                    onChange={(value: GameParams) => dispatch(setGameParams(value))}
                >
                    <BlurEnterTextInputFor name="background"></BlurEnterTextInputFor>
                    <SelectDropFor
                        getText={i => i} getValue={i => i} name="layout"
                        items={Object.values(Layout)}></SelectDropFor>
                </For>
                <For<EditorParams>
                    className={styles.gameParamsForm}
                    value={editorParams}
                    onChange={(value: EditorParams) => dispatch(setEditorParams(value))}
                >
                    <CheckboxFor name="hideInactivePath"></CheckboxFor>
                    <BlurEnterNumberInputFor name="inactivePathOpacity"></BlurEnterNumberInputFor>
                    <CheckboxFor name="draw"></CheckboxFor>
                    <CheckboxFor name="view"></CheckboxFor>

                </For>
            </div>
        </div>
    );
});
