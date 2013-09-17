Ext.define("App.controller.Tickets", {

    extend: "Ext.app.Controller",
	alias: "widget.Tickets",
    config: {
        refs: {
            // We're going to lookup our views by xtype.
			mainPanelView: "mainpanelview",
			photoTakenView: "phototakenview",
            ticketsListView: "ticketslistview",
			ticketsMapView: "ticketsmapview",
			categoriesListView: "categorieslistview",
            ticketNewEditorView: "ticketneweditorview",
			thanksPageView: "thankspageview",
			ticketsDetailsView: "ticketsdetailsview",
            ticketsList: "#ticketsList"
        },
        control: {
			'map' : {
				maprender : 'onGMapRender'
			},
			mainPanelView: {
				issuesListCommand : "onReportedIssuesFromMain",
				newIssueCommand: "onPhotoTakenFromMain"
			},
			photoTakenView: {
				backToMainPanelCommand: "activateMainPanel",
				goToCatagoriesList:"onGoToCatagoriesListFromPhoto"
			},
            ticketsListView: {
                // The commands fired by the tickets list container.
				ticketsDetailsCommand: "activateTicketsDetailsCommand",
				backToMainPanelCommand: "activateMainPanel",
				mapTicketsList: "activateTicketsMapFromList"
            },
			ticketsMapView: {
				maprerender : 'onGMapRender',
				backFromMap: "activateTicketsListCommand"
			},
			categoriesListView: {
				newTicketCommand: "onNewTicketCommand",
                backFromCategoriesListCommand: "onBackToPhotoTaken"
			},
			ticketsDetailsView: {
				backFromTicketsDetailsCommand: "backToFromDetailPanel",
			},
            ticketNewEditorView: {
                // The commands fired by the ticket editor.
				photoTaken : "onPhotoTakenFromMain",
                saveTicketCommand: "onSaveTicketCommand",
                deleteTicketCommand: "onDeleteTicketCommand",
                backToCategoriesListCommand: "onBackToCategoriesListCommand"
            },
			thanksPageView: {
				backtoMainPanel: "activateMainPanel"
			}

        }
    },
    // Transitions
    slideLeftTransition: { type: 'slide', direction: 'left' },
    slideRightTransition: { type: 'slide', direction: 'right' },

    activatePhotoTaken: function(transitions){
		Ext.Viewport.animateActiveItem(this.getPhotoTakenView(), transitions);	
	},
	activateReportedIssues: function(transitions) {
		var ticketsStore = Ext.getStore("Tickets");
		if(App.app.setCitizenParams.nearBy){
			ticketsStore.load({
				params:{sortBy: 'nearBy',latitude:App.app.setCitizenParams.latitude,longitude:App.app.setCitizenParams.longitude}
			});
		}else{
			// ticketsStore.load({params:{device_id:App.app.setCitizenParams.device_id}});
			ticketsStore.load({
				params:{latitude:App.app.setCitizenParams.latitude,longitude:App.app.setCitizenParams.longitude}
			});
		}
		Ext.Viewport.animateActiveItem(this.getTicketsListView(), transitions);
	},
	activateMainPanel: function () {
		var mainView = this.getMainPanelView();
		Ext.Viewport.animateActiveItem(mainView,  this.slideRightTransition);
    },
	activateCategoriesList: function (transitions) {
		var dataCategories = Ext.getStore('Categories');
		dataCategories.load();
		Ext.Viewport.animateActiveItem(this.getCategoriesListView(), transitions);
    },
	activateTicketsMapFromList: function() {
		this.activateTicketsMap(this.slideLeftTransition);
	},
	activateTicketsMap: function(transition) {
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
        this.onGMapRender(currentMap, gmap);
		Ext.Viewport.animateActiveItem(this.getTicketsMapView(), transition);	
			
	},
	onReportedIssuesFromMain: function() {
		//myMask = new Ext.LoadMask(Ext.getBody(), {message:"Loading Tickets..."});
		//myMask.show();
		//timeout = setTimeout(App.app.onHideMask, 3500);
		Ext.getCmp('nearByMine').setPressedButtons([0]);
		this.activateReportedIssues(this.slideLeftTransition);		
	},
	onPhotoTakenFromMain: function() {
		this.activatePhotoTaken(this.slideLeftTransition);
	},
	onBackToPhotoTaken: function() {
		this.activatePhotoTaken(this.slideRightTransition);
	},
	onGoToCatagoriesListFromPhoto: function() {
		App.app.setCitizenParams.image_blob = '';
		this.activateCategoriesList(this.slideLeftTransition);
	},
	activateTicketsList: function (transitions) {
		//myMask = new Ext.LoadMask(Ext.getBody(), {message:"Loading Tickets..."});
		//myMask.show();
		//timeout = setTimeout(App.app.onHideMask, 3500);
		var ticketsStore = Ext.getStore("Tickets");
		ticketsStore.removeAll();
		if(App.app.setCitizenParams.nearBy){
			ticketsStore.load({
				params:{sortBy: 'nearBy',latitude:App.app.setCitizenParams.latitude,longitude:App.app.setCitizenParams.longitude}
			});
		}else{
			ticketsStore.load({params:{device_id:App.app.setCitizenParams.device_id}});
		}
		Ext.Viewport.animateActiveItem(this.getTicketsListView(), transitions);
    },	
    activateTicketEditor: function (record) {
		var ticketNewEditorView = this.getTicketNewEditorView();
		ticketNewEditorView.setRecord(record); 
		Ext.Viewport.animateActiveItem(ticketNewEditorView, this.slideLeftTransition);		
	},
    onTicketsListFromMainPanelCommand: function () {
		this.activateTicketsList(this.slideLeftTransition);
    },
	backToFromDetailPanel: function() {
		if(App.app.setCitizenParams.ticketDetailFrom == 'list')
			this.activateTicketsList(this.slideRightTransition);
		else
			this.activateTicketsMap(this.slideRightTransition);
	},
	activateTicketsListCommand: function () {
		Ext.Viewport.animateActiveItem(this.getTicketsListView(), this.slideRightTransition);
    },
	activateMainPanel: function () {
		Ext.Viewport.animateActiveItem(this.getMainPanelView(), this.slideRightTransition);
	},
	activateTicketsDetailsCommand : function (recordId) {	
		var carouselItems = [];
		var TicketsDetailsCarousial = Ext.getCmp('ticketsDetailsCarousial');
		var dataTicketsDetails = Ext.getStore('Tickets');
        // dataTicketsDetails.load();
		for(i=0;i<dataTicketsDetails.data.keys.length;i++) {
			if(recordId == dataTicketsDetails.data.all[i].data.id)
			 var index = i;
			var created 	=	dataTicketsDetails.data.all[i].data.requested_datetime;
			var media_url = dataTicketsDetails.data.all[i].data.media_url;
			var	detailPanel =   '<div ><div class="info-panel">'+
								'<div class="list-item-line1-bold">Service Name :</div><div class="list-item-line2">'+dataTicketsDetails.data.all[i].data.service_name+'</div>'+
								'<div class="list-item-line1-bold">Description :</div><div class="list-item-line2">'+dataTicketsDetails.data.all[i].data.description+'</div>'+
								'<div class="list-item-line1-bold">Status :</div><div class="list-item-line2">'+dataTicketsDetails.data.all[i].data.status+'</div>'+
								//'<div class="list-item-line1-bold">Device ID :</div><div class="list-item-line2">'+dataTicketsDetails.data.all[i].data.device_id+'</div>'+
								'<div class="list-item-line1-bold">Created Date :</div><div class="list-item-line2">'+created+'</div>'+
								'<div class="list-item-line1-bold">Image :</div><div class="list-item-line2">';
			if(media_url != '' && media_url != null){
				detailPanel =detailPanel+'<img src='+media_url+' width="98%">';
			}
			else
				detailPanel =detailPanel+'No Image';
			detailPanel =detailPanel+'</div></div></div>';
			carouselItems.push({
				xtype:'panel',
				html:detailPanel,
				scrollable: {
					direction: 'vertical',
					directionLock: true
				}
			});			
		}
		TicketsDetailsCarousial.removeAll();
		TicketsDetailsCarousial.setItems(carouselItems);
		TicketsDetailsCarousial.setActiveItem(index);
        Ext.Viewport.animateActiveItem(this.getTicketsDetailsView(), this.slideLeftTransition);
	},
	onNewTicketFromMainPanelCommand: function () {
		
	},
	onCategoriesListCommand: function () {
		this.activateCategoriesList(this.slideLeftTransition);
	},
	onBackToCategoriesListCommand: function () {
		this.activateCategoriesList(this.slideRightTransition);
	},
    onNewTicketCommand: function (service_code,service_name) {
		Ext.getCmp('newTicketForm').reset();        
		App.app.getCurrentLocationPosition();
		var latlng = new google.maps.LatLng(localStorage.getItem("current_latitude_store"),localStorage.getItem("current_longitude_store"));
		if(App.app.setCitizenParams.address_string !== null && App.app.setCitizenParams.address_string != ''){
			Ext.getCmp('address_string').setValue(App.app.setCitizenParams.address_string);			
		}
		else{
			geocoder.geocode({'latLng': latlng}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					Ext.getCmp('address_string').setValue(results[0].formatted_address);					
				}
			});
		}
		if(App.app.setCitizenParams.description != ''){
			Ext.getCmp('description').setValue(App.app.setCitizenParams.description);
		}
		
		if(service_name.length >= 14)
		var service_title = service_name.slice(0,12)+'..';
		else 
		var service_title = service_name;
		Ext.getCmp('newTicketTitle').setTitle(service_title);
		Ext.getCmp('service_code').setValue(service_code);
		Ext.getCmp('service_name').setValue(service_name);
		if(App.app.setCitizenParams.image_blob != ''){
            Ext.getCmp('newTicketImagePanel').show(true);
			Ext.getCmp('newTicketImageContent').setHtml('<img src="data:image/jpeg;base64,'+App.app.setCitizenParams.image_blob+'" width="70" height="70">');
		}
		else{
			Ext.getCmp('newTicketImagePanel').hide(true);
		}
		
		var newTicket = Ext.create("App.model.Ticket", {
            email: "",
			address_string:"",
            latitude:"",
			longitude:"",
			device_id:"",
            description: "",
			media_data:App.app.setCitizenParams.image_blob,
			status:"open",
            service_code: service_code,
			service_name: service_name
        });
		delete newTicket.data.id;
		this.activateTicketEditor(newTicket);
    },
    onSaveTicketCommand: function () {
		myMask = new Ext.LoadMask(Ext.getBody(), {message:"Saving Tickets..."});
		myMask.show();
		//timeout = setTimeout(App.app.onHideMask, 8000);
        var ticketNewEditorView = this.getTicketNewEditorView();
        var currentTicket = ticketNewEditorView.getRecord();
		var newValues = Ext.getCmp('newTicketForm').getValues();
		if(newValues.address_string ==''){
			Ext.Msg.alert('Error', 'Please to enter the Address for this Issue', Ext.emptyFn);
		}else if(newValues.description == ''){
			Ext.Msg.alert('Error', 'Please to enter the Description for this Issue', Ext.emptyFn);
		}
		else {
			// Update the current ticket's fields with form values.
			currentTicket.set("address_string", newValues.address_string);
			currentTicket.set("service_code", newValues.service_code);
			currentTicket.set("service_name", newValues.service_name);
			currentTicket.set("description", newValues.description);
			currentTicket.set("email", newValues.email);
			currentTicket.set("latitude",App.app.setCitizenParams.latitude);
			currentTicket.set("longitude",App.app.setCitizenParams.longitude);
			currentTicket.set("device_id", device.uuid);
			var errors = currentTicket.validate();		
			if (!errors.isValid()) {
				Ext.Msg.alert('Wait!', errors.items[0]._message, Ext.emptyFn);
				currentTicket.reject();
				return;
			}
			var ticketsStore = Ext.getStore("Tickets");
			//  for update option
			if (null == ticketsStore.findRecord('id', currentTicket.data.id)) {
				//ticketsStore.add(currentTicket);				
				
				Ext.Ajax.request({
					//url: localhost_path+"Tickets.php?action=create&jurisdiction_id="+jurisdiction_id,
                    url:"http://23.23.193.45/postTicket?api_key=dc189c48f1047585aecd09333a597b7a&jurisdiction_id="+jurisdiction_id,
                    method: 'POST',
					params: 
					{
						service_code : currentTicket.data.service_code,
						service_name : currentTicket.data.service_name,
						description : currentTicket.data.description,
						address_string : currentTicket.data.address_string,
						email : currentTicket.data.email,
						latitude : currentTicket.data.latitude,
						longitude : currentTicket.data.longitude,
						media_data: App.app.setCitizenParams.image_blob,
						device_id : currentTicket.data.device_id
					},
					success: function(result) {
                        myMask.hide();
                        var jsonData = Ext.JSON.decode(result.responseText);
                        //if(jsonData["message"][0].token != undefined && jsonData["message"][0].token != '') {
                        if(jsonData[0].token != undefined && jsonData[0].token != '') {
                                 App.app.activateThanksPageContainer();
						}else {
							Ext.Msg.alert('Error', 'There is some unexpected error arrived..Please try again later..', Ext.emptyFn);
						}
					},
					failure: function(result) {
						Ext.Msg.alert('Error', 'Please try again later..', Ext.emptyFn);
                        myMask.hide();
					}
				});
			}
		}
    },
    onDeleteTicketCommand: function () {
        var ticketNewEditorView = this.getTicketNewEditorView();
        var currentTicket = ticketNewEditorView.getRecord();
        var ticketsStore = Ext.getStore("Tickets");
        ticketsStore.remove(currentTicket);
        ticketsStore.sync();
		this.activateMainPanel();
    }, 
	onGMapRender: function(map, gmap, options) {
		// To get Latitude and Longitude of Current location 
		App.app.getCurrentLocationPosition();
		var current_latitude = parseFloat(localStorage.getItem("current_latitude_store"));
		var current_longitude = parseFloat(localStorage.getItem("current_longitude_store"));
		
		var minlatitude  = current_latitude - 100;
		var maxlatitude  = current_latitude + 100;
		var minlongitude = current_longitude - 100;
		var maxlongitude = current_longitude + 100;
		
		var mapRenderQryCount = 1;
		
		var currentMap = Ext.getCmp('gtmap');
		var recenterPoint = new google.maps.LatLng(current_latitude,current_longitude);
		currentMap.setMapCenter(recenterPoint);
		current_location_marker=new google.maps.Marker({
			position: new google.maps.LatLng(current_latitude,current_longitude),
			map: gmap,
			draggable: false,
			icon: 'resources/icons/current_point.png',
			animation: google.maps.Animation.DROP
		});
		var ticketsStore = Ext.getStore("Tickets");
		if(App.app.setCitizenParams.nearBy){
			ticketsStore.load({
				params:{sortBy: 'nearBy',latitude:App.app.setCitizenParams.latitude,longitude:App.app.setCitizenParams.longitude}
			});
		}else{
			// ticketsStore.load({params:{device_id:App.app.setCitizenParams.device_id}});
			ticketsStore.load({
				params:{latitude:App.app.setCitizenParams.latitude,longitude:App.app.setCitizenParams.longitude}
			});
		}
		
		for(var dataconut =0; dataconut < ticketsStore.data.all.length; dataconut++)
		{
			var record = ticketsStore.data.all[dataconut].data;
			if(record.latitude != '' && record.longitude != ''){
				var markpoint = new google.maps.LatLng(record.latitude,record.longitude);
				var description = record.description;
				var marker_tpl_array=record.service_name.split(" ");
				var marker_tpl = marker_tpl_array[0]+' '+marker_tpl_array[1]+'...';
				var marker_icon = 'resources/icons/point.png';
				var marker=new google.maps.Marker({
					position: markpoint,
					map: gmap,
					draggable: false,
					record:record,
					tpl:marker_tpl,
					title:record.service_name,
					icon: marker_icon,
					animation: google.maps.Animation.DROP
				});
				markerPins.push( marker );
				
				//To set Listener for each marker
				google.maps.event.addListener(marker, 'click', function(event) {
                    var recordId = this.record.id;
                     var mapMessage = "<div style='float:left;'>";
                     if(this.record.media_url !='' && this.record.media_url != null)
                     mapMessage=mapMessage+"<img src='"+this.record.media_url;
                     else
                     mapMessage = mapMessage+"<img src='resources/icons/no_photo_icon.png";
                     mapMessage=mapMessage+ "' alt ='No Image' width='45' height='45'></div><div style='float:left;'>&nbsp;</div><div><div class=\"list-item-line2\">"+this.record.description + "</div><div align='right' style='color:#53AADF;font-size:12px;font-weight:normal;' onclick=App.app.activateTicketsDetailsFromMap("+recordId+")>More Info..</div></div>";
                     marker_infowindow.setContent(mapMessage);
                     marker_infowindow.open(gmap, this);
				});
			}
		}
	},
	// Base Class functions.
    launch: function () {
        this.callParent(arguments);
        var ticketsStore = Ext.getStore("Tickets");
        if(App.app.setCitizenParams.nearBy){
			ticketsStore.load({
				params:{sortBy: 'nearBy',latitude:App.app.setCitizenParams.latitude,longitude:App.app.setCitizenParams.longitude}
			});
		}else{
			ticketsStore.load({params:{device_id:App.app.setCitizenParams.device_id}});
		}
		console.log("launch");
    },
    init: function () {
        this.callParent(arguments);
        console.log("init");
		App.app.setCitizenParams.device_id=device.uuid;
		var ticketsStore = Ext.getStore("Tickets");
		ticketsStore.load({params:{device_id:App.app.setCitizenParams.device_id}});
    }
});