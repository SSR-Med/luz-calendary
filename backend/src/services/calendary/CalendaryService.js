/*
Must:
1. Get all Sessions by month and week depending on user_id (query params: ?date?type:(week, month))
2. Delete a session by id (/session/id/:id)
3. Confirm a session or cancel it. (/session/id/:id)
4. Create sessions, they can be created by x weeks or x months (patient) (query params: 
    ?start_date ?finish_date )
    (json payload:
        {
            "calendar": [
            {
                "day": "Monday",
                "start_hour": "10:00",
                "end_hour": "11:00"
            },
            {
                "day": "Tuesday",
                "start_hour": "10:00",
                "end_hour": "11:00"
            }
            ]
        }
        
    )
    (session/patient/id/:id).
5. They can modify sessions by x weeks or x months, those will replace any session that is in interval date (patient)
        (query params:
        ?start_date ?finish:date).
        (json payload:
        {
            "calendar": [
            {
                "day": "Monday",
                "start_time": "10:00",
                "end_time": "11:00"
            },
            {
                "day": "Tuesday",
                "start_time": "10:00",
                "end_time": "11:00"
            }
            ]
        }
        
        )
6. Can delete session in a range of dates (patient) (session/patient/id/:id) (query params: ?start_date ?finish_date).
*/
// Dependencies
const { Op } = require("sequelize");
// Models
const Patient = require('../../models/Patient');
const Session = require('../../models/Session');
// Helpers
const {getMinMaxDateInterval}  = require('../../helpers/calendary/GetIntervalDate');

// Get sessions
async function getSession(userId, date, typeIntervalDate){
    const intervalDate = getMinMaxDateInterval(date,typeIntervalDate);
    if(!intervalDate) return null;
    const searchSession = await Session.findAll({
        include: [
            {
                model: Patient,
                where: {
                    id_user: userId
                }
            }
        ],
        where: {
            date: {
                [Op.gte]: intervalDate.beforeDate,
                [Op.lte]: intervalDate.afterDate
            }
        }
        
    })
    return searchSession;
}

// Delete a session
async function deleteSession(userId, sessionId){
    const searchSession = await Session.findOne({
        include: [
            {
                model: Patient,
                where: {
                    id_user: userId
                }
            }
        ],
        where: {
            id_session: sessionId
        }
    })
    if(!searchSession) return null;
    await searchSession.destroy();
    return searchSession;
}

// Change status of a session
async function changeStatus(userId, sessionId, status){
    const searchSession = await Session.findOne({
        include: [
            {
                model: Patient,
                where: {
                    id_user: userId
                }
            }
        ],
        where: {
            id_session: sessionId
        }
    })
    if(!searchSession) return null;
    searchSession.update({
        status: status
    })
    return searchSession;

}

// Create session
async function createSession(userId,patientId,startDate,finishDate,schedule){
    if(new Date(startDate) > new Date(finishDate)) return null;
    const searchPatient = await Patient.findOne({
        where: {
            id_user: userId
        }
    })
    if(!searchPatient) return null;
}

module.exports = {
    getSession,
    deleteSession,
    changeStatus
}