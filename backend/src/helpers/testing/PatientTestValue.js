const patient1 = {
    id_user:1,
    name: 'John Doe',
    cellphone: 123456789,
    document: 2345678901,
}

const patient12 = {
    id_user:1,
    name: 'Johny',
    cellphone: 987654321,
    document: 12345678901,

}

const incorrectPatient1 = {
    ...patient1
}
delete incorrectPatient1.name

const patient2 = {
    id_user:2,
    name: 'Jane Doe',
    cellphone: 987654321,
    document: 10987654321,
}

module.exports = {
    patient1,
    incorrectPatient1,
    patient12,
    patient2
}