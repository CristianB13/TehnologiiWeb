const config = {
    max: 20,
    ssl: true,
    ssl: {
        rejectUnauthorized: false,
    },
};
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool(config);

module.exports = pool;
