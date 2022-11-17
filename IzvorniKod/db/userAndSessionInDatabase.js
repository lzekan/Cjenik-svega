//getting connection to database
const { pool } = require('../db');

const sql_create_user_table = `CREATE TABLE IF NOT EXISTS users (
    id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nickname varchar(100) NOT NULL UNIQUE,
    first_name varchar(100) NOT NULL,
    last_name varchar(100) NOT NULL,
    email varchar(320) NOT NULL UNIQUE,
    password_hash varchar(500) NOT NULL,
    access_level varchar(20) NOT NULL
); `;

const sql_create_session_table = `CREATE TABLE IF NOT EXISTS session (
    sid varchar NOT NULL COLLATE "default",
    sess json NOT NULL,
    expire timestamp(6) NOT NULL
  )
  WITH (OIDS=FALSE);`

const sql_create_session_index1 = `
    ALTER TABLE session ADD CONSTRAINT session_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE;
    `;
const sql_create_session_index2 = `
    CREATE INDEX IDX_session_expire ON session (expire);    
    `;

(async () => {
    
	//executing sql queries
    try {
		//creating user table
        await pool.query(sql_create_user_table, []);

    } catch (err) {
        console.log("Error creating users table.");
        return console.log(err.message);
    }

	try {
		//creating session table
        await pool.query(sql_create_session_table, []);

    } catch (err) {
        console.log("Error creating session table.");
        return console.log(err.message);
    }
	
	try {
		//creating session indexes
        await pool.query(sql_create_session_index1, []);
		await pool.query(sql_create_session_index2, []);
		
    } catch (err) {
        console.log("Error creating indexes.");
        return console.log(err.message);
    }

    await pool.end();

})();