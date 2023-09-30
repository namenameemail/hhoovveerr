import { Assets } from "./currentProject/assets/types";
import { currentProjectReducer } from "./currentProject";
import { Projects } from "./projectsManager/types";
import { CurrentProject } from "./currentProject/types";

export type AppState = {
    // clipboard: {},
    projects: Projects,
    currentProjectId: string | null
    currentProject: CurrentProject
}