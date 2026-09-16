const express = require("express");

const app = express();
const port = 3000;

app.use(express.json());

let nextId = 1;
let students = [
  { id: nextId++, name: "Reign", course: "BSCS" },
  { id: nextId++, name: "Jepayb", course: "BSCS" },
  { id: nextId++, name: "Jason", course: "BSCS" },
];

// GET /students - Fetch all students
app.get("/students", (req, res) => {
  res.status(200).json(students);
});

// GET /students/:id - Fetch a single student by ID
app.get("/students/:id", (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const student = students.find((s) => s.id === studentId);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.status(200).json(student);
});

// POST /students - Create a new student
app.post("/students", (req, res) => {
  const { name, course } = req.body;

  if (!name || !course) {
    return res.status(400).json({ message: "Name and course are required" });
  }

  const newStudent = { id: nextId++, name, course };
  students.push(newStudent);

  res.status(201).json(newStudent);
});

// PUT /students/:id - Update an existing student by ID
app.put("/students/:id", (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const student = students.find((s) => s.id === studentId);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const { name, course } = req.body;
  if (name) student.name = name;
  if (course) student.course = course;

  res.status(200).json(student);
});

// DELETE /students/:id - Delete a student by ID
app.delete("/students/:id", (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const index = students.findIndex((s) => s.id === studentId);

  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  const deletedStudent = students.splice(index, 1)[0];
  res.status(200).json(deletedStudent);
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});