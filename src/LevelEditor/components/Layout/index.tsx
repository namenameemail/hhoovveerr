
import cn from 'classnames';
import { ComponentType, useCallback } from "react";
import { useEditorDispatch, useEditorSelector } from "../../store";
import { Regime, selectCurrentRegime } from "../../store/currentProject/currentRegime";
import { TreeRegime } from "./regimes/Tree";
import { TemplateRegime } from "./regimes/Template";

const ComponentByRegime: Record<string, ComponentType> = {
    [Regime.Tree]: TreeRegime,
    [Regime.Template]: TemplateRegime
}

export interface LayoutProps {
}

export function Layout(props: LayoutProps) {

    const currentRegime = useEditorSelector(selectCurrentRegime);

    const CurrentRegimeComponent = ComponentByRegime[currentRegime]

    return (
        CurrentRegimeComponent && <CurrentRegimeComponent/>
    );
}

