import { Project } from "../../../store/projectsManager/types";

export type ProjectStoreOptions = {
    name: string,
}

export function createProjectsStore(options: ProjectStoreOptions) {
    const {
        name: storeName,
    } = options;


    let bound: boolean;
    let db: IDBDatabase;
    let store: IDBObjectStore;


    const bindStoreToDb = (_db: IDBDatabase) => {
        db = _db;
        store = db.transaction([storeName], "readwrite").objectStore(storeName);

        bound = true
    };

    const updateObjectStore = (_db: IDBDatabase) => {
        db = _db;
        store = db.createObjectStore(storeName, { keyPath: 'id' })

        bound = true
    };

    const getAll = (): Promise<Project[]> => {
        if (!bound) return Promise.reject(new Error('database not bound'));

        return new Promise((resolve, reject) => {

            const transaction = db.transaction([storeName], 'readonly');

            const get = transaction.objectStore(storeName).getAll();

            get.onsuccess = function (event) {

                resolve(get.result);
            };
            get.onerror = function (event) {

                reject(get.error);
            };
        });

    };

    const put = (item: Project) => {
        if (!bound) return Promise.reject(new Error('database not bound'));

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readwrite');

            const put = transaction.objectStore(storeName).put(item);

            put.onsuccess = (event) => {
                console.log('222 put', item)
                resolve(put.result);
            };

            put.onerror = (event) => {
                reject(put.error);

            };
        });

    };

    const remove = (id: string) => {
        if (!bound) return Promise.reject(new Error('database not bound'));

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([storeName], 'readwrite');

            const request = transaction.objectStore(storeName).delete(id);

            request.onsuccess = (event) => {
                resolve(request.result);
            };

            request.onerror = (event) => {
                reject(request.error);

            };
        });

    };

    return {
        getAll,
        put,
        remove,
        bindStoreToDb,
        updateObjectStore,
    };
}