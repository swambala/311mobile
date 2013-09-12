Ext.define("App.model.Category",{
	extend: "Ext.data.Model",

	config: {
		idProperty: "id",
		fields: [
			/* { name: "id", type: "integer" },
			{ name: "title", type: "string" } */
			{ name: 'service_code', type: 'string' },
            { name: 'service_name', type: 'string' },
            { name: 'metadata', type: 'string' },
            { name: 'type', type: 'string' },
			{ name: 'group', type: 'string' }
		],
		validations: [
			{ type: "presense", field: "service_code" },
			{ type: "presense", field: "service_name" }
		]
	}
});