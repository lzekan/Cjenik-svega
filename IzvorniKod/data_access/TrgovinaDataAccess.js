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
      trgovina.wrong_prices = await getWrongPricesForStore(trgovina.id);
      trgovina.comment = await getCommentForStore(trgovina.id);

      console.log(JSON.stringify(trgovina))

      return trgovina;
     }
      
   } catch (err) {
      console.log(err);
      throw err
   }
}

getWrongPricesForStore = async (store_id) => {
   const sql = `
   SELECT COUNT(*) AS "KriveCijene" FROM "PromjenaCijeneKorisnik"
   WHERE ("TrgovinaID" = $1::int AND "Status" = 'SUCCESS')
   `;

   const sql_parameters = [store_id];

   try {
      const result = await db.query(sql, sql_parameters);

      return result.rows[0].KriveCijene
      
   } catch (err) {
      console.log(err);
      throw err
   }
}

getCommentForStore = async (store_id) => {
   const sql = `
   SELECT "OpisKomentara" FROM "Komentar"
   WHERE "TrgovinaID" = $1::int
   `;

   const sql_parameters = [store_id];

   try {
      const result = await db.query(sql, sql_parameters);
      if(result.rows.length <= 0){
         return ""
      } else {
         return result.rows[0].OpisKomentara
      }      
      
   } catch (err) {
      console.log(err);
      throw err
   }
}

putItemsInStore = async (trgovinaID, barkod, proizvod, cijena) => {
   
   let sql = 'INSERT INTO "Proizvod" VALUES ($1::text, $2::text)';         //bug ako uneses proizvod sa istin barkodon
   let sql_parameters = [barkod, proizvod];

   try {
      let result = await db.query(sql, sql_parameters);
      console.log(result);  
   } catch (err) {
         console.log(err);
         throw err
   }


   sql = 'INSERT INTO "ProizvodTrgovina" VALUES ($1::text, $2::integer, $3::float)';
   sql_parameters = [barkod, trgovinaID, cijena];

   try {
      result = await db.query(sql, sql_parameters);
      console.log(result);      
   } catch (err) {
      console.log(err);
      throw err
   }

}

module.exports = {
   isUniqueID,
   addNewTrgovina,
   getTrgovina,
   putItemsInStore
}