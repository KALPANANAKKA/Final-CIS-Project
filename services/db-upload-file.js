// add all the required libraries
const express = require('express');
const cors = require('cors');
const app = express();
const knex = require('knex');
require('dotenv').config();

function dbUploadFile(data){

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

    var date = new Date(data.__createdtime__);
    date = date.toLocaleString();

    // insert the messsage with the given details to the database
    db('files')
        .insert({
            name: data.name,
            blob: data.blob,
            room: data.room,
            __createdtime__: date
        })
        .then((data) => {
            console.log('file uploaded');
            return JSON.stringify(data);
        })
        .catch((err) => {
            console.log(err);
            return null;
        });
};

module.exports = dbUploadFile;