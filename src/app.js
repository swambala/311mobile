Ext.application({
    name: "App",

    models: ["Ticket","Category"],
    stores: ["Tickets","Categories"],
    controllers: ["Tickets"],
    views: ["MainPanel","PhotoTaken","TicketsList","TicketsMap","CategoriesList", "TicketNew","ThanksPage","TicketsDetails"],
	requires:["Ext.MessageBox","Ext.device.Camera","Ext.field.Hidden","Ext.ActionSheet","Ext.SegmentedButton"],

    launch: function () {
		// Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();
        var mainPanel = {
            xtype: "mainpanelview"
        };
		 var photoTaken = {
            xtype: "phototakenview"
        };
		var ticketsListView = {
            xtype: "ticketslistview"
        };
		var ticketsMapView = {
            xtype: "ticketsmapview"
        };
		var categoriesListView = {
            xtype: "categorieslistview"
        };
		var ticketsDetailView = {
            xtype: "ticketsdetailsview"
        };
        var ticketNewEditorView = {
            xtype: "ticketneweditorview"
        };
		var thanksPageView = {
			xtype: "thankspageview"
		};
		Ext.Viewport.add([mainPanel,photoTaken,ticketsListView,ticketsMapView,categoriesListView,ticketNewEditorView,thanksPageView,ticketsDetailView]);
                
    },
	// Transitions
    slideLeftTransition: { type: 'slide', direction: 'left' },
    slideRightTransition: { type: 'slide', direction: 'right' },
	setCitizenParams:{address_string:'', image_blob:''},
	//To get Latitude and Longitude of Current location 
	getCurrentLocationPosition: function(){
		var onSuccess = function(position) {
			localStorage.removeItem("current_latitude_store");
			localStorage.removeItem("current_longitude_store");
            if(position.coords.latitude == 0 || position.coords.latitude == '' || position.coords.latitude == 'null' || position.coords.longitude == 0 || position.coords.longitude == '' || position.coords.longitude == 'null') {
				//To set Default Latitude and Longitude by Tamilnadu-India
				localStorage.setItem("current_latitude_store", '13.060422');
				localStorage.setItem("current_longitude_store", '80.249583');
				
			}
			else {
				localStorage.setItem("current_latitude_store", position.coords.latitude);
				localStorage.setItem("current_longitude_store", position.coords.longitude);
			}
            // App.app.setCitizenParams.lat_lang = localStorage.getItem("current_latitude_store")+','+localStorage.getItem("current_longitude_store");
			App.app.setCitizenParams.latitude = localStorage.getItem("current_latitude_store");
			App.app.setCitizenParams.longitude = localStorage.getItem("current_longitude_store");
		};
		var onError = function(error) {
			localStorage.removeItem("current_latitude_store");
			localStorage.removeItem("current_longitude_store");
            //To set Default Latitude and Longitude
            localStorage.setItem("current_latitude_store", '13.060422');
			localStorage.setItem("current_longitude_store", '80.249583');
            // App.app.setCitizenParams.lat_lang = localStorage.getItem("current_latitude_store")+','+localStorage.getItem("current_longitude_store");
			App.app.setCitizenParams.latitude = localStorage.getItem("current_latitude_store");
			App.app.setCitizenParams.longitude = localStorage.getItem("current_longitude_store");
		};
		navigator.geolocation.getCurrentPosition(onSuccess, onError,{timeout:6000} );	
	},
	toSortTicketsLists: function() {
		var ticketsStore = Ext.getStore("Tickets");
		ticketsStore.setGroupField(App.app.setCitizenParams.sortField);
		if(App.app.setCitizenParams.nearBy != ''){
			ticketsStore.load({
				params:{sortBy: 'nearBy',latitude:App.app.setCitizenParams.latitude,longitude:App.app.setCitizenParams.longitude}
			});
		}else{
			ticketsStore.load({params:{device_id:App.app.setCitizenParams.device_id}});
		}
		ticketsStore.setSorters([{ property: App.app.setCitizenParams.sortField, direction: 'DESC'}]);
                
	},
	onCaptureImage: function(imageFrom){
		Ext.device.Camera.capture({
            success: function(image) {
            	myMask = new Ext.LoadMask(Ext.getBody(), {message:"Loading Tickets..."});
				myMask.show();
				timeout = setTimeout(App.app.onHideMask, 800);          
				App.app.setCitizenParams.image_blob = image;
				var categoriesListViewPanel = Ext.create('App.view.CategoriesList');
				Ext.Viewport.add(categoriesListViewPanel);
				Ext.Viewport.animateActiveItem(categoriesListViewPanel, App.app.slideLeftTransition);
			},
			failure: function() {
				Ext.Msg.alert('Error', 'Error occured while taking attachment to this tickets', Ext.emptyFn);
			},
			source: imageFrom,
            quality: 75,
            width: 320,
            height: 480,
            destination: 'data',
            encoding: 'jpg'
        });
		
	},
	activateTicketsDetailsFromMap: function(recordId) {
               
		App.app.setCitizenParams.ticketDetailFrom = 'Map';
		this.getController('Tickets').activateTicketsDetailsCommand(recordId);		
	},
	activateThanksPageContainer: function() {
        var thanksPageContainer = Ext.create('App.view.ThanksPage');
		Ext.Viewport.add(thanksPageContainer);
		Ext.Viewport.animateActiveItem(thanksPageContainer, App.app.slideLeftTransition);
	},
	onHideMask: function() {
		myMask.hide();
		clearTimeout(timeout);
        timeout = null;
	}
});