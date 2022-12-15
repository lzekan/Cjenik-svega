const db = require('../db')

module.exports = class Item {
	async getItem(barcode) {
		const sqlName = `
		SELECT "Naziv itemName"
		FROM "Proizvod"
		WHERE "Barkod" = $1::string
		`
		
		const sql_parameters_name = [barcode];
		
		try {
			let result = await db.query(sqlName, sql_parameters_name);
        
			if(result.rows.length != 1){
				return undefined
			}
			else {
				let item = {
					name: result.rows[0].itemName;
				};
				
				const sqlStores = `
				SELECT "Naziv", "NovaCijena", "DatumVrijeme"
				FROM "PromjenaCijeneTrgovina"
						NATURAL JOIN "Trgovina"
				WHERE "Barkod" = $1::string
				order by "DatumVrijeme" desc`
				
				
			}
		}
		catch (err) {
			console.log(err);
			return undefined;
		}
	}
}