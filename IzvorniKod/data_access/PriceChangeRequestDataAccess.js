const db = require('../db')
const PriceChangeRequestModel = require('../models/PriceChangeRequestModel')
const TrgovinaDataAccess = require('../data_access/TrgovinaDataAccess')
const UserDataAccess = require('../data_access/UserDataAccess')

getPendingPriceChangeRequests = async() => {
    const sql = `
    select * from "PromjenaCijeneKorisnik"
    where "Status" = 'in progress'
    `
    const sql_parameters = []

    try {
        let result = await db.query(sql, sql_parameters);

        let output = []

        for (let i = 0; i < result.rows.length; i++) {

            user_nickname = (await UserDataAccess.getById(result.rows[i].KorisnikID)).nickname;

            store_name = (await TrgovinaDataAccess.getTrgovina(result.rows[i].TrgovinaID)).naziv;
                            
            let pcr = new PriceChangeRequestModel(
                result.rows[i].ID,
                result.rows[i].KorisnikID,
                user_nickname,
                result.rows[i].TrgovinaID,
                store_name,
                result.rows[i].SlikaPath,
                result.rows[i].Barkod,
                result.rows[i].DatumVrijeme,
                result.rows[i].NovaCijena,
                result.rows[i].Status
                );
            
            output.push(pcr);                
        }

        return output;
        
    } catch (err) {
        console.log(err);
        throw err
    }
}

getById = async(id) => {
    const sql = `
    select * from "PromjenaCijeneKorisnik"
    where "ID" = $1::int
    `
    const sql_parameters = [id]

    try {
        let result = await db.query(sql, sql_parameters);

        user_nickname = (await UserDataAccess.getById(result.rows[0].KorisnikID)).nickname;

        store_name = (await TrgovinaDataAccess.getTrgovina(result.rows[0].TrgovinaID)).naziv;
                            
            let pcr = new PriceChangeRequestModel(
                result.rows[0].ID,
                result.rows[0].KorisnikID,
                user_nickname,
                result.rows[0].TrgovinaID,
                store_name,
                result.rows[0].SlikaPath,
                result.rows[0].Barkod,
                result.rows[0].DatumVrijeme,
                result.rows[0].NovaCijena,
                result.rows[0].Status
                );
            
        return pcr;

    } catch (err) {
        console.log(err);
        throw err
    }
}

rejectPriceChangeRequest = async(id) => {
    const sql = `
    update "PromjenaCijeneKorisnik"
    set "Status" = 'rejected' where "ID" = $1::int
    `
    const sql_parameters = [id]

    try {
        let result = await db.query(sql, sql_parameters);
        
    } catch (err) {
        console.log(err);
        throw err
    }
}

acceptPriceChangeRequest = async(id) => {
    const sql = `
    update "PromjenaCijeneKorisnik"
    set "Status" = 'accepted' where "ID" = $1::int
    `
    const sql_parameters = [id]

    try {
        let result = await db.query(sql, sql_parameters);
        
    } catch (err) {
        console.log(err);
        throw err
    }
}

module.exports = {
    getPendingPriceChangeRequests,
    rejectPriceChangeRequest,
    acceptPriceChangeRequest,
    getById
}