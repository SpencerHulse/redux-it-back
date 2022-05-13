export function pluralize(name, count) {
  if (count === 1) {
    return name;
  }
  return name + "s";
}

export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    // Open the connection with the database "shop-shop" with a version of 1
    const request = window.indexedDB.open("shop-shop", 1);

    // Create variables to hold reference to the database, transaction, and object store
    let db, tx, store;

    // If the version has changed or it is the first time using the database...
    // run the following method and create three object stores
    request.onupgradeneeded = function (event) {
      // Not the global db
      const db = request.result;
      // Create an object store for each type of data...
      // then set the "primary" key index to be the _id of the data
      db.createObjectStore("products", { keyPath: "_id" });
      db.createObjectStore("categories", { keyPath: "_id" });
      db.createObjectStore("cart", { keyPath: "_id" });
    };

    // Handle any errors with connecting
    request.onerror = function (err) {
      console.log("There was an error");
    };

    // On database open success
    request.onsuccess = function (event) {
      // Save a reference of the database to the db variable
      db = request.result;
      // Open a transaction to do whatever we pass into "storeName"
      // (must match one of the object store names)
      tx = db.transaction(storeName, "readwrite");
      // Save a reference to that object store
      store = tx.objectStore(storeName);

      // If there is an error...
      db.onerror = function (err) {
        console.log("error", err);
      };

      // The functionality we want to perform
      switch (method) {
        case "put":
          store.put(object);
          resolve(object);
          break;
        case "get":
          const all = store.getAll();
          all.onsuccess = function () {
            resolve(all.result);
          };
          break;
        case "delete":
          store.delete(object._id);
          break;
        default:
          console.log("No valid method");
          break;
      }

      // When the transaction completes, the connection is closed
      tx.oncomplete = function () {
        db.close();
      };
    };
  });
}
