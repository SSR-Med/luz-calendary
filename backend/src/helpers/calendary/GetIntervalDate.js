// Models
const Session = require('../../models/Session');
const Patient = require('../../models/Patient');

function getBeforeDate(date,typeIntervalDate){
    const actualDate = new Date(date);
    let beforeDate;
    if(typeIntervalDate === 'month'){
        beforeDate = new Date(actualDate.getFullYear(),actualDate.getMonth(),0);
        const beforeDay = beforeDate.getDay()
        beforeDate.setDate(beforeDate.getDate() - beforeDay);
    }
    else if(typeIntervalDate === 'week'){
        beforeDate = new Date(actualDate.valueOf())
        beforeDate.setDate(beforeDate.getDate()-actualDate.getDay())
    }
    else{
        return null
    }
    return beforeDate
}

function getAfterDate(date,typeIntervalDate){
    const actualDate = new Date(date);
    let afterDate;
    let afterDay;
    if(typeIntervalDate === 'month'){
        afterDate = new Date(actualDate.getFullYear(),actualDate.getMonth()+1,0);
        afterDay = 6 - afterDate.getDay();
        afterDate.setDate(afterDate.getDate() + afterDay);
    }
    else if(typeIntervalDate === 'week'){
        afterDate = new Date(actualDate.valueOf())
        afterDay = 6 - actualDate.getDay();
        afterDate.setDate(afterDate.getDate()+afterDay)
    }
    else{
        return null
    }
    return afterDate
}



function getMinMaxDateInterval(date,typeIntervalDate){
    const beforeDate = getBeforeDate(date,typeIntervalDate);
    const afterDate = getAfterDate(date,typeIntervalDate);
    if (!beforeDate || !afterDate) return null;
    return {
        "beforeDate": beforeDate,
        "afterDate": afterDate
    }
}

function getDaysBetweenDates(startDate,finishDate,dayName){
    let result = [];
    const dayEnum = {
        "sunday": 0,
        "monday": 1,
        "tuesday": 2,
        "wednesday": 3,
        "thursday": 4,
        "friday": 5,
        "saturday": 6
    }
    const day = dayEnum[dayName.toLowerCase()];
    let current = new Date(startDate)
    // Go to the x day of the week
    current.setDate(current.getDate() + (day - current.getDay() + 7) % 7);
    // Iterate over the days
    while(current <= finishDate){
        result.push(new Date(current));
        current.setDate(current.getDate() + 7);
    }
    return result
}

function getDatesBetweenInterval(startDate,finishDate,schedule){
    let resultScheduleCalendar = {...schedule};
    const actualDate = new Date(startDate);
    const endDate = new Date(finishDate);
    /* Iterate over the days of the week (schedule days), then assign the start_hour and end_hour, at the 
       end of the iteration, assign the dates where the session will be held*/
    const scheduleCalendarKeys = Object.keys(schedule);
    for(let i = 0; i < scheduleCalendarKeys.length; i++){
        resultScheduleCalendar[scheduleCalendarKeys[i]]["start_hour"] = schedule[scheduleCalendarKeys[i]]["start_hour"];
        resultScheduleCalendar[scheduleCalendarKeys[i]]["end_hour"] = schedule[scheduleCalendarKeys[i]]["end_hour"];
        const sessionWeekDay = getDaysBetweenDates(actualDate,endDate,scheduleCalendarKeys[i])
        if (sessionWeekDay.length === 0) return null;
        resultScheduleCalendar[scheduleCalendarKeys[i]]["dates"] = sessionWeekDay;
    }
    return resultScheduleCalendar
}

async function createSessionBetweenDateInterval(userId,patientId,schedule){
    const scheduleCalendarKeys = Object.keys(schedule);
    let weekDay;
    let dateSession;
    // For each day of the week
    for(let i = 0; i < scheduleCalendarKeys.length; i++){
        // For each session of the weekDay
        weekDay = schedule[scheduleCalendarKeys[i]];
        for(let j=0; j< weekDay["dates"].length; j++){
            // Search if there is a session previously created
            dateSession = weekDay["dates"][j];
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
                    date: dateSession,
                    id_patient: patientId
                }
            });
            // If there is no session, then create it
            if(!searchSession){
                await Session.create({
                    id_patient: patientId,
                    date: dateSession,
                    start_hour: weekDay["start_hour"],
                    end_hour: weekDay["end_hour"]
                });
            }
        }
    }
}

module.exports = {getMinMaxDateInterval,
    getDatesBetweenInterval,
    createSessionBetweenDateInterval};