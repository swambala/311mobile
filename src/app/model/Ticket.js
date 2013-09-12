Ext.define("App.model.Ticket", {
    extend: "Ext.data.Model",
    config: {
        idProperty: 'id',
        fields: [
            { name: 'id', mapping: 'service_request_id', type: 'string' },
            { name: 'status', type: 'string' },
            { name: 'status_notes', type: 'string' },
            { name: 'service_name', type: 'string' },
			{ name: 'service_code', type: 'string' },
			{ name: 'description', type: 'string' },
			{ name: 'requested_datetime', type: 'string'},
			{ name: 'updated_datetime', type: 'string'},
			{ name: 'address', type: 'string' },
			{ name: 'address_string', type: 'string' },
			{ name: 'email', type: 'string' },
			{ name: 'latitude', mapping:'lat', type: 'string' },
			{ name: 'longitude', mapping:'long', type: 'string' },
			{ name: 'media_url', type: 'string' },
			{ name: 'device_id', type: 'string' }
        ],
        validations: [
            /*{ type: 'presence', field: 'subject', message: 'Please enter the subject for this ticket.' } ,
			{ type: 'presence', field: 'name', message: 'Please enter your name.' },
			{ type: 'presence', field: 'email', message: 'Please enter your email address.' } */
        ]
    }
});