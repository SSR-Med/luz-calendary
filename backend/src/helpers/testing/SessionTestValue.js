const calendary1 = {
    "Monday":{
        "start_hour": "08:00",
        "end_hour": "09:00"
    },
    "Tuesday":{
        "start_hour": "08:00",
        "end_hour": "09:00"
    },
    "Friday":{
        "start_hour": "08:00",
        "end_hour": "09:00"
    }
}

const calendary1WrongWeekDay = {
    "onday":{
        "start_hour": "08:00",
        "end_hour": "09:00"
    },
    "Tuesday":{
        "start_hour": "08:00",
        "end_hour": "09:00"
    },
    "Wednesday":{
        "start_hour": "08:00",
        "end_hour": "09:00"
    }
}

const calendary1WrongHourName = {
    "Monday":{
        "start": "08:00",
        "end_hour": "09:00"
    },
    "Tuesday":{
        "start_hour": "08:00",
        "end_hour": "09:00"
    },
    "Wednesday":{
        "start_hour": "08:00",
        "end_hour": "09:00"
    }
}

const calendary1WrongHourOrder = {
    "Monday":{
        "start": "09:00",
        "end_hour": "09:00"
    },
    "Tuesday":{
        "start_hour": "10:00",
        "end_hour": "09:00"
    },
    "Wednesday":{
        "start_hour": "08:00",
        "end_hour": "09:00"
    }
}

const calendary1WrongHourType = {
    "Monday":{
        "start_hor": "a",
        "end_hour": "09:00"
    },
    "Tuesday":{
        "start_hour": "08:00",
        "end_hour": "09:00"
    },
    "Wednesday":{
        "start_hour": "08:00",
        "end_hour": "09:00"
    }
}

const calendary2 = {
    "Monday":{
        "start_hour": "08:00",
        "end_hour": "09:00"
    }
}

module.exports = {calendary1, calendary1WrongWeekDay,calendary1WrongHourName,
calendary1WrongHourOrder, calendary1WrongHourType, calendary2}