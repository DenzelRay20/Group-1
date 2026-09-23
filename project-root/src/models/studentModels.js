let nextId = 1;
const students = [
    { id: nextId++, name: "Reign", course: "BSCRIM" },
    { id: nextId++, name: "Jepayb", course: "BSED" },
    { id: nextId++, name: "Jason", course: "BSM" },
];

const getNextId = () => nextId++;

module.exports = {
    students,
    getNextId
};