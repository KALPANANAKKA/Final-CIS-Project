// add all the required libraries
const express = require('express');
const cors = require('cors');
const app = express();
const knex = require('knex');
require('dotenv').config();

function dbGetMessages(Room){
    // console.log('inside dbGetMessages');
    // get the database details to connect to the database
    const db = knex({
        client: 'pg',
        connection: {
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE,
        },
    });

    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    app.use(cors());

    // select all messsages with the given room name from the database
    return new Promise((resolve, reject) => {
        db.select('*')
        .from('messages')
        .where('room', '=', Room)
        .limit(10)
        .then((response) => {
            console.log("fetched response");
            // console.log(JSON.stringify(response));
            return resolve(JSON.stringify(response));
        })
        .catch((err) => {
            reject(err);
        });
    });
}

module.exports = dbGetMessages;