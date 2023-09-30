import { ComponentType, useCallback, useState } from "react";
import { useEditorDispatch, useEditorSelector } from "../../store";
import { Regime, selectCurrentRegime } from "../../store/currentProject/currentRegime";
import {
    addEmptyProject,
    openProject,
    removeProject,
    selectIsProjectManagerOpen,
    selectProjects, setProjectManagerOpen
} from "../../store/projectsManager";
import styles from './styles.module.css';
import { selectCurrentProjectId, setCurrentProjectId } from "../../store/currentProjectId";


export interface ProjectManagerProps {
}

export function ProjectManager(props: ProjectManagerProps) {

    const projects = useEditorSelector(selectProjects);
    const isProjectManagerOpen = useEditorSelector(selectIsProjectManagerOpen);
    const currentProjectId = useEditorSelector(selectCurrentProjectId);
    const dispatch = useEditorDispatch();

    const [newProjName, setNewProjName] = useState('');


    const handleAdd = useCallback(() => {
        dispatch(addEmptyProject({ name: newProjName }));
    }, [newProjName]);

    const handleSelect = useCallback((id: string) => {
        dispatch(openProject(id));
    }, [newProjName]);

    const handleDelete = useCallback((id: string) => {
        dispatch(removeProject(id));
    }, [newProjName]);

    return isProjectManagerOpen ? (
        <div className={styles.projectManager} onClick={() => {
            currentProjectId && dispatch(setProjectManagerOpen(false))
        }}>
            <div className={styles.modal} onClick={(e) => {
                e.stopPropagation()

            }}>
                <input
                    placeholder={'add'}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            dispatch(addEmptyProject({ name: e.target.value }));
                            e.target.value = '';
                        }
                    }}
                />
                <div className={styles.items}>
                    {Object.entries(projects).map(([id, project], index) => {
                        return (
                            <div className={styles.projectItem} key={id}>
                                <button onClick={() => handleDelete(id)}>del</button>
                                <div onClick={() => handleSelect(id)}>{project.name}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    ) : null;
}

