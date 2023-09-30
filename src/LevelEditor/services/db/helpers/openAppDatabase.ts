export type AppDatabaseOptions = {
    name: string,
    onupgradeneeded: (db: IDBDatabase, event: IDBVersionChangeEvent) => void
    onsuccess: (db: IDBDatabase) => void
}

export function openAppDatabase(options: AppDatabaseOptions) {
    const {
        name: dbName,
        onupgradeneeded,
        onsuccess,
    } = options;

    const dbVersion = 1;
    let db: IDBDatabase;


    const request = indexedDB.open(dbName, dbVersion);

    request.onsuccess = function (event) {
        console.log("Success creating/accessing IndexedDB database");
        db = request.result;

        onsuccess(db)

        db.onerror = function (event) {
            console.log("Error creating/accessing IndexedDB database");
        };
    };

    request.onupgradeneeded = function (event) {
        const db = request.result;
        onupgradeneeded(db, event);
    };

}