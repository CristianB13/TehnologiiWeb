const pool = require("../databaseConnection");

function createUser(user) {
    let queryText = "insert into users (first_name, last_name, email, username, password) values ($1, $2, $3, $4, $5)";
    let queryValues= [user.firstName, user.lastName, user.email, user.username, user.password];
    return new Promise((resolve, reject) => {
        pool.query(queryText, queryValues).then(results => {
            console.log(results);
            resolve(results);
        }).catch(error => {
            reject(error);
        })
    })
}

function findByUsername(username) {
    let queryText = "select * from users where username = $1";
    return new Promise((resolve, reject) => {
        pool.query(queryText, [username])
        .then((results) => {
            if(!results.rows[0]) {
                reject("user not found");
            }
            resolve(results.rows[0]);
        })
        .catch((error) => {
            reject(error);
        });
    })
}

function deleteByUsername(username) {
    let queryText = "delete from users where username = $1";
    return new Promise((resolve, reject) => {
        pool.query(queryText, [username])
        .then((results) => {
            resolve(results);
        })
        .catch((error) => {
            reject(error);
        });
    })
}

function updateUser(columnName, value, username){
    let queryText = `update users set ${columnName} = $1 where username=$2`;
    return new Promise((resolve, reject) => {
        pool.query(queryText, [value, username])
        .then((results) => {
            resolve(results);
        })
        .catch((error) => {
            reject(error);
        });
    })
}

function createImage(image) {
    console.log("PUBLIC_ID" , image.public_id);
    let queryText = "insert into images (user_id, src, public_id) values ($1, $2, $3)";
    let queryValues= [image.user_id, image.src, image.public_id];
    return new Promise((resolve, reject) => {
        pool.query(queryText, queryValues).then(results => {
            console.log(results);
            resolve(results);
        }).catch(error => {
            reject(error);
        });
    });
}

function getUserImages(userId){
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

function findImageBySrc(src){
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

function findImageById(id){
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

function updateImage(columnName, value, id){
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

function deleteImageById(id){
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

module.exports = {
    createUser,
    findByUsername,
    deleteByUsername,
    updateUser,
    createImage,
    getUserImages,
    findImageBySrc,
    findImageById,
    updateImage,
    deleteImageById
};
