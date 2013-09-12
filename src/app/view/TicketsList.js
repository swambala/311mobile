Ext.define("App.view.TicketsList", {
    extend: "Ext.Container",
    requires:"Ext.dataview.List",
    alias: "widget.ticketslistview",

    config: {
        layout: {
            type: 'fit'
        },
		style:'background-color:#555555;',
        items: [{
            xtype: "toolbar",
            title: "<p style='padding-left:15px;'>Reported Issues</p>",
            docked: "top",
			margin:0,
            items: [
                {
					xtype: "button",
					ui: "back",
					text: "Back",
					itemId: "backButtonFromTicketsList"
				},
				{ xtype: 'spacer' },
				{
					xtype: "button",
					text: "Map",
					itemId: "mapTicketsList"
				}
            ]
        }, {
            xtype: "toolbar",
            docked: "top",
			margin:0,
            items: [
                {
					xtype: "button",
					width:"75px",
					text: "Sort",
					itemId: "sortButtonFromTicketsList"
				},
				{ xtype: 'spacer' },
				{
					xtype: 'segmentedbutton',
					id:'nearByMine',
					hidden:true,
					items: [
						{
							text: 'Mine',
							pressed: true,
							id: "mineByButtonFromTicketsList",
							itemId: "mineByButtonFromTicketsList"
						},
						{
							text: "Near by",
							itemId: "nearByButtonFromTicketsList"
						}
					]
				}
            ]
        },{
            xtype: "list",
			store: "Tickets",
			cls:"citizen-list",
            itemId:"ticketsList",
            loadingText: "Loading Tickets...",
            emptyText: "<div class=\"notes-list-empty-text\">No tickets found.</div>",
            onItemDisclosure: true,
            grouped: true,
			itemTpl: "<div><div style='float:left;'><tpl if='media_url'><img src='{media_url}' width='50px' height:'30px'><tpl else><img src='resources/icons/no_photo_icon.png'></tpl></div><div class=\"list-item-narrative\" style=\"max-width: 210px;overflow: hidden; white-space: nowrap; text-overflow: ellipsis;\">{description}</div></div>"       
			//itemTpl: "<div><tpl if='media_url'><img src='{media_url}' width='50px' height:'30px'><tpl else><img src='resources/icons/no_photo_icon.png'></tpl></div><div class=\"list-item-narrative\" style=\"max-width: 210px;overflow: hidden; white-space: nowrap; text-overflow: ellipsis;\">{description}</div></div>"
        }],
        listeners: [
		{
			delegate: "#backButtonFromTicketsList",
			event: "tap",
			fn: "onBackFromTicketsListButtonTap"
		},
		{
			delegate: "#sortButtonFromTicketsList",
			event: "tap",
			fn: "onSortItemTab"
		},
		{
			delegate: "#nearByButtonFromTicketsList",
			event: "tap",
			fn: "onNearByItemTab"
		},
		{
			delegate: "#mineByButtonFromTicketsList",
			event: "tap",
			fn: "onMineByItemTab"
		},
		{
			delegate: "#backButtonFromTicketsList",
			event: "tap",
			fn: "onBackFromTicketsListButtonTap"
		},
		{
			delegate: "#mapTicketsList",
			event: "tap",
			fn: "onMapTicketsList"
		},
		{
			delegate: "#ticketsList",
			event: "itemtap",
			fn: "onTicketsListItemTab"
		},
		{
            delegate: "#ticketsList",
            event: "disclose",
            fn: "onTicketsListDisclose"
        }]
    },
	onBackFromTicketsListButtonTap: function () {
		App.app.setCitizenParams.nearBy = '';
        this.fireEvent("backToMainPanelCommand", this);
    },
	onMapTicketsList: function () {
		this.fireEvent("mapTicketsList");
	},
	onTicketsListItemTab: function (DataView, index, target, record, e, eOpts) {
		App.app.setCitizenParams.ticketDetailFrom = 'list';
        this.fireEvent('ticketsDetailsCommand', record.data.id );
    },
    onTicketsListDisclose: function (list, record, target, index, evt, options) {
		App.app.setCitizenParams.ticketDetailFrom = 'list';
        this.fireEvent('ticketsDetailsCommand', record.data.id );
    },
	onSortItemTab: function() {
		var actionSheet = Ext.create('Ext.ActionSheet', {
			items: [
				{
					text: 'By Date',
					handler: function() {
						actionSheet.hide();
						App.app.setCitizenParams.sortField ='requested_datetime';
						App.app.toSortTicketsLists();
					}
				},
				{
					text: 'By Status',
					handler: function() {
						actionSheet.hide();
						App.app.setCitizenParams.sortField ='status';
						App.app.toSortTicketsLists();
					}
				},
				{
					text: 'By Category',
					handler: function() {
						actionSheet.hide();
						App.app.setCitizenParams.sortField ='service_name';
						App.app.toSortTicketsLists();
					}
				},
				{
					text: 'Cancel',
					ui  : 'decline',
					handler: function() {
						actionSheet.hide();
					}
				}
			]
		});

		Ext.Viewport.add(actionSheet);
		actionSheet.show();
	},
	onMineByItemTab: function() {
		App.app.setCitizenParams.nearBy = '';
		var ticketsStore = Ext.getStore("Tickets");
		//ticketsStore.load({params:{device_id:App.app.setCitizenParams.device_id}});
		ticketsStore.load({
			params:{latitude:App.app.setCitizenParams.latitude,longitude:App.app.setCitizenParams.longitude}
		});
	},
	onNearByItemTab: function() {
		App.app.setCitizenParams.nearBy = true;
		var ticketsStore = Ext.getStore("Tickets");
        ticketsStore.load({
			params:{sortBy: 'nearBy',latitude:App.app.setCitizenParams.latitude,longitude:App.app.setCitizenParams.longitude}
		});		
	}
});