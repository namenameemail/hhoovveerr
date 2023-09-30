import { openAppDatabase } from "./helpers/openAppDatabase";
import { fontsStore, imagesStore } from "./stores/assets";
import { updateAssets } from "../../store/currentProject/assets";
import { store } from "../../store";
import { projectsStore } from "./stores/projects";
import { loadProjectsFromDb } from "../../store/projectsManager";

openAppDatabase({
    name: 'AppDatabase',
    onupgradeneeded: (db) => {

        console.log(2)
        imagesStore.updateObjectStore(db)
        fontsStore.updateObjectStore(db)
        projectsStore.updateObjectStore(db)

        store.dispatch(updateAssets('images'));
        store.dispatch(updateAssets('fonts'));
        store.dispatch(loadProjectsFromDb());
    },
    onsuccess: (db) => {
        console.log(1)
        imagesStore.bindStoreToDb(db)
        fontsStore.bindStoreToDb(db)
        projectsStore.bindStoreToDb(db)

        store.dispatch(updateAssets('images'));
        store.dispatch(updateAssets('fonts'));
        store.dispatch(loadProjectsFromDb());
    }
});
