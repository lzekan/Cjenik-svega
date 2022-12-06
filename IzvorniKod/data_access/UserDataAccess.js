const db = require('../db')
const User = require('../models/UserModel')

addNewUser = async (user) => {
    const sql = `
        INSERT INTO "Korisnik" ("Ime", "Prezime" , "Email" , "Nadimak" , "Lozinka", "RazinaPristupa") VALUES
        ($1::text, $2::text , $3::text , $4::text , $5::text, $6::smallint) RETURNING "ID";
    `;

        const sql_parameters = [user.nickname, user.first_name, user.last_name, user.email, user.password_hash, user.access_level];
    try {
        const result = await db.query(sql, sql_parameters);
        return result.rows[0].id;
    } catch (err) {
        console.log(err);
        throw err
    }
}

existsWithId = async (id) =>{
    const sql = `
    SELECT "ID", "Ime", "Prezime" , "Email" , "Nadimak" , "Lozinka", "RazinaPristupa"
    FROM "Korisnik"
    WHERE "ID" = $1::int
    `
    const sql_parameters = [id]

    try {
        let result = await db.query(sql, sql_parameters);
        return result.rows.length > 0;
    } catch (err) {
        console.log(err);
        throw err
    }
}

//returns true if there is not user in database that is already registered with that nickname or email
wouldBeUnique = async (user) => {
    const sql = `
    SELECT "ID", "Ime", "Prezime" , "Email" , "Nadimak" , "Lozinka", "RazinaPristupa"
    FROM "Korisnik"
    WHERE ("Nadimak" = $1::text OR "Email" = $2::text)
    `
    const sql_parameters = [user.nickname, user.email]

    try {
        let result = await db.query(sql, sql_parameters);
        return result.rows.length == 0;
    } catch (err) {
        console.log(err);
        throw err
    }
}

getById = async (id) =>{
    const sql = `
    SELECT "ID", "Ime", "Prezime" , "Email" , "Nadimak" , "Lozinka", "RazinaPristupa"
    FROM "Korisnik"
    WHERE "ID" = $1::int
    `
    const sql_parameters = [id]

    try {
        let result = await db.query(sql, sql_parameters);
        
        if(result.rows.length <= 0){
            return undefined
        } else {
            
            let results = result.rows

            let newUser = {}
            newUser.nickname = results[0].nickname
            newUser.first_name = results[0].first_name
            newUser.last_name = results[0].last_name
            newUser.email = results[0].email
            newUser.password_hash = results[0].password_hash,
            newUser.access_level = results[0].access_level
            newUser.id = results[0].id

            return newUser
        }

    } catch (err) {
        console.log(err);
        throw err
    }
}

getByNickname = async (nickname) =>{
    const sql = `
    SELECT "ID", "Ime", "Prezime" , "Email" , "Nadimak" , "Lozinka", "RazinaPristupa"
    FROM "Korisnik"
    WHERE "Nadimak" = $1::text
    `
    const sql_parameters = [nickname]

    try {
        let result = await db.query(sql, sql_parameters);
        
        if(result.rows.length <= 0){
            return undefined
        } else {
            
            let results = result.rows

            let newUser = {}
            newUser.nickname = results[0].Nadimak
            newUser.first_name = results[0].Ime
            newUser.last_name = results[0].Prezime
            newUser.email = results[0].Email
            newUser.password_hash = results[0].Lozinka,
            newUser.access_level = results[0].RazinaPristupa
            newUser.id = results[0].ID

            return newUser
        }

    } catch (err) {
        console.log(err);
        throw err
    }
}

getByEmail = async (email) =>{
    const sql = `
    SELECT "ID", "Ime", "Prezime" , "Email" , "Nadimak" , "Lozinka", "RazinaPristupa"
    FROM "Korisnik"
    WHERE "Email" = $1::text
    `
    const sql_parameters = [email]

    try {
        let result = await db.query(sql, sql_parameters);
        
        if(result.rows.length <= 0){
            return undefined
        } else {
            
            let results = result.rows

            let newUser = {}
            newUser.nickname = results[0].nickname
            newUser.first_name = results[0].first_name
            newUser.last_name = results[0].last_name
            newUser.email = results[0].email
            newUser.password_hash = results[0].password_hash,
            newUser.access_level = results[0].access_level
            newUser.id = results[0].id

            return newUser
        }

    } catch (err) {
        console.log(err);
        throw err
    }
}

module.exports = {
    addNewUser,
    existsWithId,
    getById,
    getByNickname,
    getByEmail,
    wouldBeUnique
}
