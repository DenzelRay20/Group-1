const { students, getNextId } = require('../models/studentModels');

const createStudent = (request, response) => {
    const newName = request.body.name;
    const newCourse = request.body.course;

    const newStudent = { id: getNextId(), name: newName, course: newCourse };
    students.push(newStudent);
    
    response.status(201).json(newStudent);
};

const getAllStudents = (request, response) => {
    response.json(students);
};

const getStudentById = (request, response) => {
    const studentId = parseInt(request.params.id);
    const student = students.find(s => s.id === studentId);

    if (student) {
        response.json(student);
    } else {
        response.status(404).json({ error: "Student not found" });
    }
};

const updateStudent = (request, response) => {
    const studentId = parseInt(request.params.id);
    const studentIndex = students.findIndex(s => s.id === studentId);

    if (studentIndex !== -1) {
        if (request.body.name) students[studentIndex].name = request.body.name;
        if (request.body.course) students[studentIndex].course = request.body.course;
        
        response.json(students[studentIndex]);
    } else {
        response.status(404).json({ error: "Student not found" });
    }
};

const deleteStudent = (request, response) => {
    const studentId = parseInt(request.params.id);
    const studentIndex = students.findIndex(s => s.id === studentId);

    if (studentIndex !== -1) {
        const deletedStudent = students.splice(studentIndex, 1);
        response.json({ message: "Student deleted successfully", deletedStudent: deletedStudent[0] });
    } else {
        response.status(404).json({ error: "Student not found" });
    }
};

module.exports = {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
};