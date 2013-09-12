Ext.define('App.view.TicketsMap', {
    extend: 'Ext.Container',
    alias: "widget.ticketsmapview",
    requires: ["Ext.Map","Ext.dataview.List","Ext.Toolbar"],
    config: {
		title: 'Toolbelt',
        baseCls: 'x-show-contact',
        layout: 'vbox',

        items: [
			{
                xtype: "toolbar",
                docked: "top",
				title: "Reported issues",
                items: [
                    {
                        xtype: "button",
                        ui: "back",
                        text: "Back",
                        itemId: "backFromMap"
                    },
                    { xtype: "spacer" },
					{
						xtype: "button",
						iconCls: 'locate',
						iconMask: true,
						itemId: "mapRecenterIcon"
					}
                ]
            },
			{
                xtype: 'map',
				flex: 1,
				id:'gtmap',
				mapOptions: {
					//To set current location as center point..
					center : new google.maps.LatLng(localStorage.getItem("current_latitude_store"),localStorage.getItem("current_longitude_store")),
					zoomControl: true,
					zoomControlOptions: {
						style: google.maps.ZoomControlStyle.LARGE,
						position: google.maps.ControlPosition.LEFT_BOTTOM
					},
					mapTypeControl: false,
					mapTypeControlOptions: {
						mapTypeIds: [google.maps.MapTypeId.ROADMAP]
					},
					streetViewControl: false					
                }
            }
        ],
		
		listeners:[
			{
                delegate: "#mapRecenterIcon",
                event: "tap",
                fn: "onMapRecenter"
            },{
                delegate: "#backFromMap",
                event: "tap",
                fn: "onBackFromMap"
            }
		],

        record: null
    },
	onMapRecenter: function () {        
        while(markerPins[0]){
           markerPins.pop().setMap(null);
        }        
        markerPins.length = 0;           
        App.app.getCurrentLocationPosition(); 
		current_location_marker.setMap(null);
		var currentMap = Ext.getCmp('gtmap');
		var recenterPoint = new google.maps.LatLng(localStorage.getItem("current_latitude_store"),localStorage.getItem("current_longitude_store"));
		currentMap.setMapCenter(recenterPoint);
		var gmap = Ext.getCmp('gtmap').getMap();
           
        this.fireEvent("maprerender", currentMap, gmap);
    },
    onBackFromMap: function () {
        this.fireEvent('backFromMap');
	}
});
