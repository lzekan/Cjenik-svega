/*
This script is used to generate database locally.
*/

//getting connection to database
const { pool } = require('../db');

const sql_create_tables_in_db = ` BEGIN;


COMMIT;
`;

(async () => {
    
	//executing sql query
    try {
		//creating domain tables
        await pool.query(sql_create_tables_in_db);
        console.log("Domain tables created.")

    } catch (err) {
        console.log("Error creating domain tables.");
        return console.log(err.message);
    }

    await pool.end();

})();