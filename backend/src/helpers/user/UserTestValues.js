
const admin2 = {
    name: "admin2",
    email: "admin2@gmail.com",
    password: "admin2",
    role: true
}
const admin3 = {
    name: "admin3",
    email: "admin3@gmail.com",
    password: "admin3",
    role: true
}
const admin4 = {
    name: "admin4",
    email: "admin4@gmail.com",
    password: "admin4",
    role: true
}

const incorrectAdmin2 = {...admin2}
delete incorrectAdmin2.name;

module.exports = 
{
    admin2,
    incorrectAdmin2,
    admin3,
    admin4
}