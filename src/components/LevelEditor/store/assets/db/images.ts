const dbVersion = 1;
export const request = indexedDB.open("images", dbVersion);

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
    db.createObjectStore('images', { keyPath: 'name' });
};

export interface DBImage {
    blob: Blob;
    name: string;
    // id: number;
    size: number;
}

export const getImages = (): Promise<DBImage[]> => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["images"], 'readwrite');
        const get = transaction.objectStore("images").getAll()
        get.onsuccess = function (event) {

            resolve(get.result)
        };
        get.onerror = function (event) {

            reject(get.error)
        };
    });

}

export const putImage = (dbImage: Omit<DBImage, 'id'>) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["images"], 'readwrite');

        const put = transaction.objectStore("images").put(dbImage);

        put.onsuccess = (event) => {
            resolve(put.result)
        }

        put.onerror = (event) => {
            resolve(put.error)

        }
    })

};

export const deleteImage = (name: string) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["images"], 'readwrite');

        const request = transaction.objectStore("images").delete(name);

        request.onsuccess = (event) => {
            resolve(request.result)
        }

        request.onerror = (event) => {
            resolve(request.error)

        }
    })

};