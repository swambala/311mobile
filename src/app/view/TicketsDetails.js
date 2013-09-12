Ext.define("App.view.TicketsDetails", {
    extend: "Ext.Container",
    requires:["Ext.dataview.List","Ext.Carousel","Ext.Img"],
    alias: "widget.ticketsdetailsview",

    config: {
        layout: {
            type: 'fit'
        },
		/* scrollable: {
			direction: 'vertical',
			directionLock: true
		}, */
		items: [{
            xtype: "toolbar",
            title: "Issues",
            docked: "top",
            items: [
                {
					xtype: "button",
					ui: "back",
					text: "Back",
					itemId: "ticketsDetailsBackButton"
				},
				{ xtype: "spacer" }
            ]
        },{
			xtype: "carousel",
			id:"ticketsDetailsCarousial",
			fullscreen:true
		}],
        listeners: [
		{ 
			delegate: "#ticketsDetailsBackButton",
			event: "tap",
			fn: "onBackTicketsDetailsButtonTap"
		}]
    },
	onBackTicketsDetailsButtonTap: function () {
		this.fireEvent("backFromTicketsDetailsCommand");
    }
});