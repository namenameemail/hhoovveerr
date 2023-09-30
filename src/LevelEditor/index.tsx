import React, { CSSProperties, useMemo } from "react";
import { Provider as StoreProvider } from 'react-redux';
import { store } from './store';
import { Layout } from "./components/Layout";
import { ProjectManager } from "./components/ProjectManager";
import { DivRefProvider } from "./components/Preview/context/DivRefContext";


export interface LevelEditorProps {

}

export const LevelEditor = (function (LevelEditor: React.ComponentType<LevelEditorProps>) {
    return (props: LevelEditorProps) => (
        <DivRefProvider>
            <StoreProvider store={store}>
                <LevelEditor {...props}/>
                <ProjectManager/>
            </StoreProvider>
        </DivRefProvider>
    );
})(function (props: LevelEditorProps) {

    return <Layout/>
});
