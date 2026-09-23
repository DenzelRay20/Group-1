// Controllers now delegate all data access to the async, database-backed
// functions in studentModels.js instead of mutating an in-memory array.
const {
    getAllStudents: getAllStudentsFromDb,
    getStudentById: getStudentByIdFromDb,
    createStudent: createStudentInDb,
    updateStudent: updateStudentInDb,
    deleteStudent: deleteStudentFromDb,
} = require('../models/studentModels');

const createStudent = async (request, response) => {
    try {
        const { name, course } = request.body;

        if (!name || !course) {
            return response.status(400).json({ error: "Name and course are required" });
        }

        const newStudent = await createStudentInDb(name, course);
        response.status(201).json(newStudent);
    } catch (error) {
        console.error("Error creating student:", error.message);
        response.status(500).json({ error: "Failed to create student" });
    }
};

const getAllStudents = async (request, response) => {
    try {
        const students = await getAllStudentsFromDb();
        response.json(students);
    } catch (error) {
        console.error("Error fetching students:", error.message);
        response.status(500).json({ error: "Failed to fetch students" });
    }
};

const getStudentById = async (request, response) => {
    try {
        const studentId = parseInt(request.params.id, 10);
        const student = await getStudentByIdFromDb(studentId);

        if (student) {
            response.json(student);
        } else {
            response.status(404).json({ error: "Student not found" });
        }
    } catch (error) {
        console.error("Error fetching student:", error.message);
        response.status(500).json({ error: "Failed to fetch student" });
    }
};

const updateStudent = async (request, response) => {
    try {
        const studentId = parseInt(request.params.id, 10);
        const { name, course } = request.body;

        const updatedStudent = await updateStudentInDb(studentId, name, course);

        if (updatedStudent) {
            response.json(updatedStudent);
        } else {
            response.status(404).json({ error: "Student not found" });
        }
    } catch (error) {
        console.error("Error updating student:", error.message);
        response.status(500).json({ error: "Failed to update student" });
    }
};

const deleteStudent = async (request, response) => {
    try {
        const studentId = parseInt(request.params.id, 10);
        const deletedStudent = await deleteStudentFromDb(studentId);

        if (deletedStudent) {
            response.json({ message: "Student deleted successfully", deletedStudent });
        } else {
            response.status(404).json({ error: "Student not found" });
        }
    } catch (error) {
        console.error("Error deleting student:", error.message);
        response.status(500).json({ error: "Failed to delete student" });
    }
};

module.exports = {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
};
