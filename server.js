const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
var PORT = process.env.PORT || 9000;
const mainDir = path.join(__dirname, "/public");

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/notes", function(req, res) {
    res.sendFile(path.join(mainDir, "notes.html"));
});

app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./Develop/db/db.json"));
});

app.get("/api/notes/:id", function(req, res) {
    let createdNotes = JSON.parse(fs.readFileSync("./Develop/db/db.json", "utf8"));
    res.json(createdNotes[Number(req.params.id)]);
});

app.get("*", function(req, res) {
    res.sendFile(path.join(mainDir, "index.html"));
});

app.post("/api/notes", function(req, res) {
    let createdNotes = JSON.parse(fs.readFileSync("./Develop/db/db.json", "utf8"));
    let newNote = req.body;
    let noteId = (createdNotes.length).toString();
    newNote.id = noteId;
    createdNotes.push(newNote);

    fs.writeFileSync("./Develop/db/db.json", JSON.stringify(createdNotes));
    console.log("Note saved to db.json File as: ", newNote);
    res.json(createdNotes);
})

app.delete("/api/notes/:id", function(req, res) {
    let createdNotes = JSON.parse(fs.readFileSync("./Develop/db/db.json", "utf8"));
    let noteID = req.params.id;
    let newID = 0;
    console.log(`ID ${noteID} has been deleted`);
    createdNotes = createdNotes.filter(currentNote => {
        return currentNote.id != noteID;
    })
    
    for (currentNote of createdNotes) {
        currentNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./Develop/db/db.json", JSON.stringify(createdNotes));
    res.json(createdNotes);
})

app.listen(PORT, function() {
    console.log(`Currently listening to port ${PORT}.`);
})