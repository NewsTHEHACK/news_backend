let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/locnews";

let buildDB = () => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        console.log("build!");
        db.close();
    });
};

let insertDB = (insertObject) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        let dbase = db.db("news");
        dbase.collection("news").insertOne(insertObject, function(err, res) {
            if (err) throw err;
            console.log("insert!");
            db.close();
        });
    });
};

let searchDB = (searchObject, operateFunction) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        let dbo = db.db("news");
        dbo.collection("news").find(searchObject).toArray(function(err, result) {
            if (err) throw err;
            operateFunction(result);
            db.close();
        });
    });
};

module.exports = {buildDB: buildDB,
                    insertDB: insertDB,
                    searchDB: searchDB};
