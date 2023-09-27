const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid');

const port = process.env.PORT || 3001;

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route for the notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Route for all notes
app.get('/api/notes', (req, res) => {
    const notesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'db.json')));
    res.json(notesData);
});

// route to save a new note
app.post('/api/notes', (req, res) => {
    const notesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'db.json')));
    const newNote = {
        id: uuid(), 
        title: req.body.title,
        text: req.body.text,
    };

    // Push the new note to notesData
    notesData.push(newNote);

    // Write the updated notes array back to the database
    fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notesData));

    res.json(newNote);
});

// Route to delete a note
app.delete('/api/notes/:id', (req, res) => {

    // Get the id of the note to delete
    const noteId = req.params.id;
    const notesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'db', 'db.json')));


    // Filter out the note with the matching id
    const newNotesData = notesData.filter(note => note.id !== noteId);

    // Write the updated notes data back to the database
    fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(newNotesData));

    res.json(newNotesData);
});

// Route for index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);
