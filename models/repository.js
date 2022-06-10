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

module.exports = {
    createUser,
    findByUsername,
    deleteByUsername,
    updateUser
};
