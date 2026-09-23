CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    course VARCHAR(255) NOT NULL
);


INSERT INTO students (name, course)
SELECT * FROM (VALUES
    ('Reign', 'BSCRIM'),
    ('Jepayb', 'BSED'),
    ('Jason', 'BSM')
) AS seed(name, course)
WHERE NOT EXISTS (SELECT 1 FROM students);
