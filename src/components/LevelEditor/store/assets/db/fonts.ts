const dbVersion = 1;
export const request = indexedDB.open("fonts", dbVersion);

let db: IDBDatabase;
request.onsuccess = function (event) {
    console.log("Success creating/accessing IndexedDB database");
    db = request.result;

    db.onerror = function (event) {
        console.log("Error creating/accessing IndexedDB database");
    };
};

request.onupgradeneeded = function (event) {
    const db = request.result
    db.createObjectStore('fonts', { keyPath: 'name' });
};

export interface DBFont {
    blob: Blob;
    name: string;
    // id: number;
    size: number;
}

export const getFonts = (): Promise<DBFont[]> => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["fonts"], 'readwrite');
        const get = transaction.objectStore("fonts").getAll()
        get.onsuccess = function (event) {

            resolve(get.result)
        };
        get.onerror = function (event) {

            reject(get.error)
        };
    });

}

export const putFont = (dbFont: Omit<DBFont, 'id'>) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["fonts"], 'readwrite');

        const put = transaction.objectStore("fonts").put(dbFont);

        put.onsuccess = (event) => {
            resolve(put.result)
        }

        put.onerror = (event) => {
            resolve(put.error)

        }
    })

};

export const deleteFont = (name: string) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["fonts"], 'readwrite');

        const request = transaction.objectStore("fonts").delete(name);

        request.onsuccess = (event) => {
            resolve(request.result)
        }

        request.onerror = (event) => {
            resolve(request.error)

        }
    })

};