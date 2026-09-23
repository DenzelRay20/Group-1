const pool = require('../config/db');

const getAllStudents = async () => {
    const result = await pool.query('SELECT * FROM students ORDER BY id ASC');
    return result.rows;
};

const getStudentById = async (id) => {
    const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
    return result.rows[0] || null;
};

const createStudent = async (name, course) => {
    const result = await pool.query(
        'INSERT INTO students (name, course) VALUES ($1, $2) RETURNING *',
        [name, course]
    );
    return result.rows[0];
};

const updateStudent = async (id, name, course) => {
    const existing = await getStudentById(id);
    if (!existing) return null;

    const updatedName = name || existing.name;
    const updatedCourse = course || existing.course;

    const result = await pool.query(
        'UPDATE students SET name = $1, course = $2 WHERE id = $3 RETURNING *',
        [updatedName, updatedCourse, id]
    );
    return result.rows[0];
};

const deleteStudent = async (id) => {
    const result = await pool.query('DELETE FROM students WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
};

module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
};