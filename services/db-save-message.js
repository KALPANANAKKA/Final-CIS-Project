// add all the required libraries
const express = require('express');
const cors = require('cors');
const app = express();
const knex = require('knex');
require('dotenv').config();

function dbSaveMessage(Message, Username, Room, timestamp){

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

    var date = new Date(timestamp);
    date = date.toLocaleString();

    // insert the messsage with the given details to the database
    db('messages')
        .insert({
            username: Username,
            message: Message,
            room: Room, 
            __createdtime__: date
        })
        .then((data) => {
            console.log('message added');
            return JSON.stringify(data);
        })
        .catch((err) => {
            console.log(err);
            return null;
        });
};

module.exports = dbSaveMessage;