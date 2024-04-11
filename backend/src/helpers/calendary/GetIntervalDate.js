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
    let dates = [];
    const actualDate = new Date(startDate);
    const endDate = new Date(finishDate);
    

}

module.exports = {getMinMaxDateInterval};