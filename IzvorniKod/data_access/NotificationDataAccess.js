const db = require('../db')
const NotificationModel = require('../models/NotificationModel')

getNotificationsForUser = async(user_id) => {
    const sql = `
    select "ObavijestID" 
    from "Pretinac" join "Obavijest" on "Pretinac"."ObavijestID" = "Obavijest"."ID"
    where "KorisnikID" = $1::int
    order by "DatumVrijeme" desc
    `
    const sql_parameters = [user_id]

    try {
        let result = await db.query(sql, sql_parameters);
        let notifications = [];
            for (let i = 0; i < result.rows.length; i++){
                notifications.push(await getNotification(result.rows[i].ObavijestID))
            }
            return notifications
    } catch (err) {
        console.log(err);
        throw err
    }
}

getNotification = async(notification_id) => {
    const sql = `
    select * from "Obavijest" where "ID" = $1::int
    `
    const sql_parameters = [notification_id]

    try {
        let result = await db.query(sql, sql_parameters);
        if(result.rows.length == 0){
            return undefined
        } else {
            return new NotificationModel(result.rows[0].ID, result.rows[0].DatumVrijeme, result.rows[0].Opis, result.rows[0].Procitano)
        }
    } catch (err) {
        console.log(err);
        throw err
    }
}

addNotification = async(text) => {
    const sql = `
    insert into "Obavijest" ("DatumVrijeme", "Opis", "Procitano")
    values ($1, $2::text, $3::bool) returning "ID"
    `
    const sql_parameters = [new Date(), text, false]

    try {
        let result = await db.query(sql, sql_parameters);
        return result.rows[0].ID;
    } catch (err) {
        console.log(err);
        throw err
    }
}

notifyUser = async(user_id, notification_id) => {
    const sql = `
    insert into "Pretinac" ("KorisnikID", "ObavijestID")
    values ($1::int, $2::int);
    `
    const sql_parameters = [user_id, notification_id]

    try {
        let result = await db.query(sql, sql_parameters);
        
    } catch (err) {
        console.log(err);
        throw err
    }
}

module.exports = {
    getNotificationsForUser,
    addNotification,
    notifyUser
}