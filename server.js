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

// GET * should return the index.html file.
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET /notes should return the notes.html file.
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
    res.status(200).json(savedNotes);
});

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client.
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body; // object destructuring

    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            title,
            text,
            // random id assigned
            id: Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1),
        };

        const response = {
            status: 'success',
            body: newNote,
        };

        // pushes newNote to JSON
        savedNotes.push(newNote)

        // sends response back to index.js
        res.status(201).json(response);
    }

    // appends JSON to db.json file
    writeToFile(savedNotes)
});

// DELETE /api/notes/:id should receive a query parameter that contains the id of a note to delete.
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id

    if (id) {
        console.info(`${req.method} request received to delete note`);

        // looping over json to find ids
        for (let i = 0; i < savedNotes.length; i++) {
            const currentID = savedNotes[i];
            // matching the request id to delete to id in db.json
            if (currentID.id === id) {
                // sends JSON back to index.js
                res.send(currentID);

                // removes the object with that id
                savedNotes.splice(i, 1);

                // writes to file after deletion
                writeToFile(savedNotes)
        
                return;
            }
        }
        // error if no ids are found
        res.status(404).json('ID not found');
    }
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});

// TODO: Create a function to write to db.json 
function writeToFile(notes) {
    let data = JSON.stringify(notes);

    console.log("JSON data:", data);

    fs.writeFileSync('./db/db.json', data + "\n", (err) =>
        err ? console.log(err) : console.log('Success!')
    );
}