const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

//connection url
const url = process.env.DB_URL;

//DB names
const dbName = 'shop_inventory';
const collName = 'inventory';

//DB settings
const settings = { useUnifiedTopology: true };

const getInventory = () => {
    const promise = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client){
            if(err){
                reject(err);
            } else {
                console.log(`Successfully connected to DB: ${dbName} for GET.`);
                const db = client.db(dbName);
                const collection = db.collection(collName);
                collection.find({}).toArray(function(err,docs){
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

const addInventory = (item) => {
    const promise = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, async function(err, client){
            if(err){
                reject(err);
            } else {
                console.log(`Successfully connected to DB: ${dbName} for POST.`);
                const db = client.db(dbName);
                const collection = db.collection(collName);
                collection.insertOne(item, (err, result) => {
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

const deleteInventory = (id) => {
    const promise = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, async function(err, client){
            if(err){
                reject(err);
            } else {
                console.log(`Successfully connected to DB: ${dbName} for DELETE.`);
                const db = client.db(dbName);
                const collection = db.collection(collName);
                await collection.deleteOne({_id: ObjectID(id)}, function(err, result){
                    if(err){
                        reject(err);
                    } else {
                        resolve({deleted_id: id});
                        client.close();
                    };
                })
            };
        })
    })
    return promise;
};

const editInventory = (id, inventory) => {
    const promise = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, async function(err, client){
            if(err){
                reject(err);
            } else {
                console.log(`Successfully connected to DB: ${dbName} for PUT.`);
                const db = client.db(dbName);
                const collection = db.collection(collName);
                await collection.update(
                    {_id: ObjectID(id)},
                    {$set:{
                        name: inventory.name,
                        desc: inventory.desc,
                        quantity: inventory.quantity,
                        price: inventory.price,
                        isActive: inventory.isActive
                    }},
                    {upsert: true},
                    (err, result) => {
                        if(err){
                            console.log(err);
                        } else {
                            resolve({updated_id: id});
                            client.close();
                        };
                    }
                )
            };
        })

    })
    return promise;
}

module.exports = {
    getInventory,
    addInventory,
    deleteInventory,
    editInventory
}