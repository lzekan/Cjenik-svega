const ItemDataAccess = require('../data_access/ItemDataAccess.js');

module.exports = class Item {
	constructor(name, stores, tags) {
        this.name = name;
		this.stores = stores;
		this.tags = tags;
    }
	
	async getItem(barcode) {
		let name = await ItemDataAccess.getItemName(barcode);
		let stores = await ItemDataAccess.getStores(barcode);
		let tags = await ItemDataAccess.getTags(barcode);
		let item = new Item(name, stores, tags);
		return item;
	}
}