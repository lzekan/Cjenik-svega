const db = require('../db')
const Trgovina = require('../models/TrgovinaModel')

isUniqueID = async(id) => {
   const sql = 'SELECT COUNT("ID") FROM "Trgovina" WHERE "ID" = $1::int'
   const sql_parameters = [id];
   try{
       let result = await db.query(sql, sql_parameters);
       let count = result.rows[0];
       if(count.count < 1){
           return true;
       }else{
           return false;
       }
       
   }catch(err){
       console.log(err);
       throw err
   }
}

addNewTrgovina = async(trgovina) =>{
   const sql = `
   INSERT INTO "Trgovina" ("ID", "Naziv") VALUES
   ($1::int, $2::text) RETURNING "ID";
`;

   const sql_parameters = [trgovina.id, trgovina.naziv];
   try {
      const result = await db.query(sql, sql_parameters);
      return result.rows[0].id;
   } catch (err) {
      console.log(err);
      throw err
   }
}


module.exports = {
   isUniqueID,
   addNewTrgovina
}