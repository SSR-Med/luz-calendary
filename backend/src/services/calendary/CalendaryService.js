// Dependencies
const { Op } = require("sequelize");
// Models
const Patient = require('../../models/Patient');
const Session = require('../../models/Session');
// Helpers
const {getMinMaxDateInterval, getDatesBetweenInterval, createSessionBetweenDateInterval}  = require('../../helpers/calendary/GetIntervalDate');

// Get all Sessions by month and week depending on user_id (query params: ?date?type:(week, month))
async function getSession(userId, date, typeIntervalDate){
    const intervalDate = getMinMaxDateInterval(date,typeIntervalDate);
    if(!intervalDate) return "Invalid date";
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

// Delete a session by id (/session/id/:id)
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
    if(!searchSession) return "Session not found";
    await searchSession.destroy();
    return searchSession;
}

// Confirm a session or cancel it. (/session/id/:id)
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
    if(!searchSession) return "Session not found";
    searchSession.update({
        status: status
    })
    return searchSession;

}

/* Create sessions, they can be created by x weeks or x months (patient) (query params: ?start_date ?finish_date )
    (json payload:
        {
            "Monday":{
                "start_hour": "10:00",
                "end_hour": "11:00"
            },
            "Tuesday":{
                "start_hour": "10:00",
                "end_hour": "11:00"
            }
        }
        
    )
    (session/patient/id/:id).
*/
async function createSession(userId,patientId,startDate,finishDate,schedule){
    if(new Date(startDate) > new Date(finishDate)) return "Invalid date";
    const searchPatient = await Patient.findOne({
        where: {
            id_user: userId
        }
    })
    if(!searchPatient) return "Patient not found";
    // Get the schedule dictionary with the dates for the sessions
    const scheduleCalendar = getDatesBetweenInterval(startDate,finishDate,schedule);
    if (!scheduleCalendar) return "Invalid schedule";
    // Create the session
    await createSessionBetweenDateInterval(userId,patientId,scheduleCalendar);
    return "Sessions created";
}

// They can modify sessions by x weeks or x months, those will replace any session that is in interval date (patient) (json and route similar to create)
async function modifySession(userId,patientId,startDate,finishDate,schedule){
    if(new Date(startDate) > new Date(finishDate)) return "Invalid date";
    const searchPatient = await Patient.findOne({
        where: {
            id_user: userId
        }
    })
    if(!searchPatient) return "Patient not found";;
    // Delete all sessions in the interval date
    await Session.destroy({
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
            },
            id_patient: patientId
        }
    });
    // Get the schedule dictionary with the dates for the sessions
    const scheduleCalendar = getDatesBetweenInterval(startDate,finishDate,schedule);
    if (!scheduleCalendar) return "Invalid schedule";
    // Create the session
    await createSessionBetweenDateInterval(userId,patientId,scheduleCalendar);
    return "Sessions modified";
}

// Can delete session in a range of dates (patient) (session/patient/id/:id) (query params: ?start_date ?finish_date).
async function deleteMultipleSession(userId,patientId,startDate,finishDate){
    if(new Date(startDate) > new Date(finishDate)) return null;
    const searchPatient = await Patient.findOne({
        where: {
            id_user: userId
        }
    })
    if(!searchPatient) return "Patient not found";
    await Session.destroy({
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
                [Op.gte]: startDate,
                [Op.lte]: finishDate
            },
            id_patient: patientId
        }
    });
    return "Sessions deleted";
}

module.exports = {
    getSession,
    deleteSession,
    changeStatus,
    createSession,
    modifySession,
    deleteMultipleSession
}