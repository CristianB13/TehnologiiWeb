const pool = require("../databaseConnection");

function create(image) {
    let queryText = "insert into images (user_id, src, public_id, exif_data, description) values ($1, $2, $3, $4, $5)";
    let queryValues= [image.user_id, image.src, image.public_id, image.exif_data, image.description];
    return new Promise((resolve, reject) => {
        pool.query(queryText, queryValues).then(results => {
            console.log(results);
            resolve(results);
        }).catch(error => {
            reject(error);
        });
    });
}

function getAll() {
    let queryText = "select * from images";
    return new Promise((resolve, reject) => {
        pool.query(queryText).then(results => {
            resolve(results.rows);
        }).catch(error => {
            reject(error);
        });
    });
}

function findByUserId(userId){
    let queryText = "select * from images where user_id = $1";
    let queryValues= [userId];
    return new Promise((resolve, reject) => {
        pool.query(queryText, queryValues).then(results => {
            resolve(results.rows);
        }).catch(error => {
            reject(error);
        });
    });
}

function findBySrc(src){
    let queryText = "select * from images where src = $1";
    let queryValues= [src];
    return new Promise((resolve, reject) => {
        pool.query(queryText, queryValues).then(results => {
            resolve(results.rows);
        }).catch(error => {
            reject(error);
        });
    });
}

function findById(id){
    let queryText = "select * from images where id = $1";
    let queryValues= [id];
    return new Promise((resolve, reject) => {
        pool.query(queryText, queryValues).then(results => {
            resolve(results.rows);
        }).catch(error => {
            reject(error);
        });
    });
}

function update(columnName, value, id){
    let queryText = `update images set ${columnName} = $1 where id=$2`;
    return new Promise((resolve, reject) => {
        pool.query(queryText, [value, id])
        .then((results) => {
            resolve(results);
        })
        .catch((error) => {
            reject(error);
        });
    })
}

function deleteById(id){
    let queryText = "delete from images where id = $1";
    return new Promise((resolve, reject) => {
        pool.query(queryText, [id])
        .then((results) => {
            resolve(results);
        })
        .catch((error) => {
            reject(error);
        });
    })
}

function findPublic(keyword){
    let queryText = "select * from images where access = true and description like '%' || $1 || '%'";
    let queryValues= [keyword];
    return new Promise((resolve, reject) => {
        pool.query(queryText, queryValues).then((results) => {
            resolve(results);
        }).catch((error) => {
            reject(error);
        })
    })
}

module.exports = {
    create,
    findByUserId,
    findBySrc,
    findById,
    update,
    deleteById,
    findPublic,
    getAll
};