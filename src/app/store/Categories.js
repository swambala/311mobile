Ext.define("App.store.Categories",{
	extend: "Ext.data.Store",

	requires: ["App.model.Category"],

	config: {
		model: "App.model.Category",
		proxy: {
			type: "ajax",
			url: localhost_path+"CategoriesList.php",
			reader: {
				type: "json",
				rootProperty: "categories"
			}
		},
		autoLoad: true
	}
});