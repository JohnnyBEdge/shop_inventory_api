const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

//connection url
const url = process.env.DB_URL;

//DB names
const dbName = 'shop_inventory';
const collName = 'accounts';

//DB settings
const settings = { useUnifiedTopology: true };

const getAccountByEmail = (key, value) => {
    const promise = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client){
            if(err){
                reject(err);
            } else {
                console.log(`Successfully connected to DB: ${dbName} for GET.`);
                const db = client.db(dbName);
                const collection = db.collection(collName);
                collection.find({[key] : value}).toArray(function(err,docs){
                    if(err){
                        reject(err);
                    } else {
                        console.log(docs);
                        resolve(docs);
                        client.close();
                    };
                })
            };
        })
    })
    return promise;
}

const addAccount = (account) => {
    const promise = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, async function(err, client){
            if(err){
                reject(err);
            } else {
                console.log(`Successfully connected to DB: ${dbName} for POST.`);
                const db = client.db(dbName);
                const collection = db.collection(collName);
                collection.insertOne(account, (err, result) => {
                    if(err){
                        console.log(err);
                    } else {
                        resolve(result.ops[0]);
                        client.close();
                    }
                })
            };
        })
    })
    return promise;
};

module.exports = {
    getAccountByEmail,
    addAccount
}