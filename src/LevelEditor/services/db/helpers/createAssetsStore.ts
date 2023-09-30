export type AssetStoreOptions = {
    name: string,
}

export type AssetDbItem = {
    id: number
    projectId: string
    name: string;
    blob: Blob
    size: number
}

export type AssetNewItem = {
    projectId: string
    name: string;
    blob: Blob
    size: number
}

export function createAssetsStore<TItem extends AssetDbItem = AssetDbItem>(options: AssetStoreOptions) {
    const {
        name: storeName,
    } = options;


    let bound: boolean;
    let db: IDBDatabase;
    let store: IDBObjectStore;
    let projectIdIndex: IDBIndex;


    const bindStoreToDb = (_db: IDBDatabase) => {
        db = _db;
        store = db.transaction([storeName], "readwrite").objectStore(storeName);

        projectIdIndex = store.index("projectId");
        bound = true
    };
    const updateObjectStore = (_db: IDBDatabase) => {
        db = _db;
        store = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true })

        store.createIndex("projectId", "projectId", { unique: false });

        projectIdIndex = store.index("projectId");
        bound = true
    };

    const getAll = (projectId: string): Promise<TItem[]> => {
        if (!bound) return Promise.reject(new Error('database not bound'));

        return new Promise((resolve, reject) => {

            const transaction = db.transaction([storeName], 'readonly');

            const get = transaction.objectStore(storeName).index("projectId").getAll(projectId);

            get.onsuccess = function (event) {

                console.log(222, get.result)
                resolve(get.result);
            };
            get.onerror = function (event) {

                reject(get.error);
            };
        });

    };

    const put = (item: AssetNewItem) => {
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

    const remove = (id: number) => {
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