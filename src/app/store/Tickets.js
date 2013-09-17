Ext.define("App.store.Tickets", {
    extend: "Ext.data.Store",
    requires: "Ext.data.proxy.LocalStorage",
    config: {
        model: "App.model.Ticket",
        proxy: {
			type: "ajax",
			api: {
           read:"http://23.23.193.45/getTickets?jurisdiction_id="+jurisdiction_id,
                //create: localhost_path+"Tickets.php?action=create&jurisdiction_id="+jurisdiction_id,
				//read: localhost_path+"Tickets.php?jurisdiction_id="+jurisdiction_id,
				//update: localhost_path+"Tickets.php?action=update&jurisdiction_id="+jurisdiction_id,
				//destroy: localhost_path+"Tickets.php?action=delete&jurisdiction_id="+jurisdiction_id
			},
			extraParams: {
				keyword: ""
			},
			reader: {
				type: "json",
				rootProperty: "tickets"
			}
		},
        sorters: [{ property: 'requested_datetime', direction: 'DESC'}],
        grouper: {
            sortProperty: "service_name",
            direction: "ASC",
            groupFn: function (record) {
				if (record && record.data.service_name) {
                    return record.data.service_name;
                } else {
                    return '';
                }
            }
        },		
		autoLoad: false
    }
});
