const db = require('../db')
const User = require('../models/UserModel')

addNewUser = async (user) => {
    const sql = `
        INSERT INTO users (nickname, first_name , last_name , email , password_hash, access_level) VALUES
        ($1::text, $2::text , $3::text , $4::text , $5::text, $6::text) RETURNING id;
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
    SELECT nickname, first_name , last_name , email , password_hash, access_level
    FROM users
    WHERE id = $1::int
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
    SELECT nickname, first_name , last_name , email , password_hash, access_level
    FROM users
    WHERE (nickname = $1::text OR email = $2::text)
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
    SELECT id, nickname, first_name , last_name , email , password_hash, access_level
    FROM users
    WHERE id = $1::int
    `
    const sql_parameters = [id]

    try {
        let result = await db.query(sql, sql_parameters);
        
        if(result.rows.length <= 0){
            return undefined
        } else {
            let newUser = new User()
            let results = result.rows

            newUser = new User(results[0].nickname, results[0].first_name,
                results[0].last_name, results[0].email, results[0].password_hash, results[0].access_level)
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
    SELECT id, nickname, first_name , last_name , email , password_hash, access_level
    FROM users
    WHERE nickname = $1::text
    `
    const sql_parameters = [nickname]

    try {
        let result = await db.query(sql, sql_parameters);
        
        if(result.rows.length <= 0){
            return undefined
        } else {
            let newUser = new User()
            let results = result.rows

            newUser = new User(results[0].nickname, results[0].first_name,
                results[0].last_name, results[0].email, results[0].password_hash, results[0].access_level)
            newUser.id = results[0].id

            return newUser
        }

    } catch (err) {
        console.log(err);
        throw err
    }
}

getByEmail = async (email) =>{
    const sql = `
    SELECT id, nickname, first_name , last_name , email , password_hash, access_level
    FROM users
    WHERE email = $1::text
    `
    const sql_parameters = [email]

    try {
        let result = await db.query(sql, sql_parameters);
        
        if(result.rows.length <= 0){
            return undefined
        } else {
            let newUser = new User()
            let results = result.rows

            newUser = new User(results[0].nickname, results[0].first_name,
                results[0].last_name, results[0].email, results[0].password_hash, results[0].access_level)
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