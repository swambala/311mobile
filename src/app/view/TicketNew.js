Ext.define('App.view.TicketNew', {
    extend: 'Ext.Container',
    alias: 'widget.ticketneweditorview',

    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'Ext.field.Text',
		'Ext.field.Select',
		'Ext.field.DatePicker',
		'Ext.field.TextArea',
		'Ext.field.Number',
		'Ext.field.Email'
    ],

    config: {
        layout: 'vbox',
		items: [
           {
                xtype: "toolbar",
                docked: "top",
				id:"newTicketTitle",
                title: "New Issue",
                items: [
                    {
                        xtype: "button",
                        ui: "back",
                        text: "Back",
                        itemId: "backButtonFromTicketNew"
                    },
                    { xtype: "spacer" },
					{
                        xtype: "button",
                        ui: "action",
                        text: "Save",
                        itemId: "saveButton"
                    }
                ]
            },
			{
				xtype:'panel',
				id:'newTicketImagePanel',
				layout:'hbox',
				style:'background-color: #555555;',
				items:[
					{
						id: 'newTicketImageContent',
						style:'padding-top: 1em;padding-left: 1em;background-color: #555555;color:#ffffff;'						
					},
					{
						xtype:"button",
						text:'Change Picture',
						itemId: 'newTicketImageButton',
						cls:'newTicketPic',
					}
				]
			}, {
                xtype: 'formpanel',
				flex: 1,
				id:'newTicketForm',
				width:'100%',
				items: [
                    {
						xtype: 'hiddenfield',
						id: 'service_code',
						name: 'service_code'
					},
					{
						xtype: 'hiddenfield',
						id: 'service_name',
						name: 'service_name'
					},						
					{
						xtype: 'textfield',
						label: 'Location',
						name: 'address_string',
						id:'address_string',
						itemId:'address_string',
						labelAlign: 'top',    
						maxRows: 5,
						required: true
					},
					{
						xtype: 'textfield',
						label: 'Description',
						name: 'description',
						id: 'description',
						labelAlign: 'top',        
						maxRows: 3,
						required: true
					},
					{
						xtype: 'emailfield',
						label: 'Email',
						name: 'email',
						id: 'email',
						labelAlign: 'top',        
						required: true
					}
					/* {
						xtype: 'selectfield',
						label: 'Priority',
						labelAlign: 'top',        
						name: 'priority',
						options: [
							{text: 'Low',  value: '1'},
							{text: 'Normal', value: '2'},
							{text: 'High',  value: '3'}
						]
					}, */						
				]
               }		
        ],

        listeners:[
			{
                delegate: "#backButtonFromTicketNew",
                event: "tap",
                fn: "onBackFromTicketNewButtonTap"
            },
            {
                delegate: "#saveButton",
                event: "tap",
                fn: "onSaveButtonTap"
            },
			{
                delegate: "#newTicketImageButton",
                event: "tap",
                fn: "onChangeImage"
            },
			{
                delegate: "#address_string",
                event: "keyup",
                fn: "onKeyupAddress"
            },
            {
                delegate: "#deleteButton",
                event: "tap",
                fn: "onDeleteButtonTap"
            }
		],

        record: null
    },
	saveNewRecord: function() {
		var record=Ext.getCmp('newTicketForm').getValues();
		return record;
    },
	onKeyupAddress: function(){
		geocoder.geocode({ 'address_string': Ext.getCmp('address_string').getValue()}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				var latitude = results[0].geometry.location.lat();
				var longitude = results[0].geometry.location.lng();
				// App.app.setCitizenParams.lat_lang = latitude+','+longitude;
				App.app.setCitizenParams.latitude = latitude;
				App.app.setCitizenParams.longitude = longitude;
			}
		});	
	},
	onSaveButtonTap: function () {
        this.fireEvent("saveTicketCommand", this);
    },
    onDeleteButtonTap: function () {
        this.fireEvent("deleteTicketCommand", this);
    },
    onBackFromTicketNewButtonTap: function () {
        this.fireEvent("backToCategoriesListCommand", this);
    },
	onChangeImage: function () {
		App.app.setCitizenParams.address_string = Ext.getCmp('address_string').getValue();
		App.app.setCitizenParams.description = Ext.getCmp('description').getValue();
		App.app.setCitizenParams.capturePageFrom = 'form';
		this.fireEvent("photoTaken");
	}
});
