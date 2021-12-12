const express = require('express');
const path = require('path');
const fs = require('fs');
const savedNotes = require('./db/db.json');

const PORT = 3001;
const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));