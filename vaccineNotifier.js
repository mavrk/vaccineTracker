require('dotenv').config()
const moment = require('moment');
const cron = require('node-cron');
const axios = require('axios');
const tgBot = require('./telegram-bot');

const DISTRICT = process.env.DISTRICT
const AGE = process.env.AGE

async function main(){
    try {
        cron.schedule('*/5 * * * *', async () => {
             await checkAvailability();
        });
    } catch (e) {
        console.log('an error occured: ' + JSON.stringify(e, null, 2));
        throw e;
    }
}

async function checkAvailability() {

    let datesArray = await fetchNext5Days();
    console.log(datesArray);
    datesArray.forEach(date => {
        getSlotsForDate(date);
    })
}

function getSlotsForDate(DATE) {
    let config = {
        method: 'get',
        url: 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=' + DISTRICT + '&date=' + DATE,
        headers: {
            'accept': 'application/json',
            'Accept-Language': 'hi_IN'
        }
    };

    axios(config)
        .then(function (slots) {
            let sessions = slots.data.sessions;
            let validSlots = sessions.filter(slot => slot.min_age_limit <= AGE &&  slot.available_capacity > 0)
            console.log({date:DATE, validSlots: validSlots.length})
            if(validSlots.length > 0) {
                notifyMe(validSlots, DATE);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function createTemplate(slotDetails, date){
    let message = `\n\n
    * * * * * * * * * * * * * * * *
    ℹ Slot found on date ${date} \n\n`;
    for(const slot of slotDetails){
        if (slot.available_capacity < 5) {
            continue;
        }
        let slotBody = `🏦Center Name: ${slot.name}, ${slot.pincode}
        Available Capacity: ${slot.available_capacity}
        Fee Type: ${slot.fee_type}
        Vaccine: ${slot.vaccine}`
        slotBody = `${slotBody} \n`
        message = `${message} ${slotBody}\n`
    }
    return message
}

async function notifyMe(validSlots, date){    
    tgBot.telegrambot(createTemplate(validSlots, date));
};

async function fetchNext5Days(){
    let dates = [];
    let today = moment();
    for(let i = 0 ; i < 5 ; i ++ ){
        let dateString = today.format('DD-MM-YYYY')
        dates.push(dateString);
        today.add(1, 'day');
    }
    return dates;
}


main()
    .then(() => {console.log('Vaccine availability checker started.');});
