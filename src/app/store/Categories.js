Ext.define("App.store.Categories",{
	extend: "Ext.data.Store",

	requires: ["App.model.Category"],

	config: {
		model: "App.model.Category",
		proxy: {
			type: "ajax",
			//url: localhost_path+"CategoriesList.php",
           url: "http://23.23.193.45/getCategories",
           reader: {
				type: "json",
				rootProperty: "categories"
			}
		},
		autoLoad: true
	}
});