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

getTrgovina = async(user_id) =>{
   const sql = `
   select "Naziv" from "Trgovina" WHERE "ID" = $1::int;
`;

   const sql_parameters = [user_id];
   try {
      const result = await db.query(sql, sql_parameters);
      if(result.rows.length <= 0){
         return undefined
     } else {
      let trgovina = {};

      trgovina.id = user_id
      trgovina.naziv = result.rows[0].Naziv
      trgovina.wrong_prices = getWrongPricesForStore(trgovina.id);
      trgovina.comment = getCommentForStore(trgovina.id);

      console.log(JSON.stringify(trgovina))

      return trgovina;
     }
      
   } catch (err) {
      console.log(err);
      throw err
   }
}

getWrongPricesForStore = async (store_id) => {
   return 0;
}

getCommentForStore = async (store_id) => {
   return "";
}


module.exports = {
   isUniqueID,
   addNewTrgovina,
   getTrgovina
}