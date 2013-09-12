Ext.define("App.view.PhotoTaken", {
    extend: "Ext.Container",
	requires: ["Ext.Map","Ext.List","Ext.Toolbar"],
    alias: "widget.phototakenview",
	
    config: {
        title: '311Mobile',
        baseCls: 'x-show-contact',
		
		 items: [
			{
                xtype: "toolbar",
                docked: "top",
                title: "New Issue",
				margin: '0%',
                items: [
                    {
                        xtype: "button",
                        ui: "back",
						text: "Back",
                        itemId: "backButtonFromTicketNew"
                    },
                    { xtype: "spacer" }
                ]
            },
			{
				xtype:'container',
				style:'background-color:#FFC000;',
				layout: {
					type : 'vbox',
					pack : 'top',
					align: 'stretch'
				},
				defaults: {
					xtype : 'button',
					cls   : 'demobtn',
					margin: '5%',
					ui:'secondary',
				},
				height:'100%',
				items:[
					{
						text: 'Take Photo',
						itemId:'photoFromCamera'
					},
					{
						text: 'Choose Existing',
						itemId:'photoFromAlbum'
					},
					{
						text: 'Skip',
						itemId:'noPhoto'
					}
				]
			}				
        ],

		
        record: null,
       listeners:[
			{
                delegate: "#backButtonFromTicketNew",
                event: "tap",
                fn: "onBackFromTicketNewButtonTap"
            },
			{
                delegate: "#photoFromCamera",
                event: "tap",
                fn: "onPhotoFromCamera"
            },
			{
                delegate: "#photoFromAlbum",
                event: "tap",
                fn: "onPhotoFromAlbum"
            },
			{
                delegate: "#noPhoto",
                event: "tap",
                fn: "onGoToIssueForm"
            }
		],
    },
	onBackFromTicketNewButtonTap: function () {
        this.fireEvent("backToMainPanelCommand", this);
    },
	onPhotoFromCamera: function() {
		App.app.onCaptureImage('camera');
		//this.fireEvent("goToPhoto","CAMERA");
	},
	onPhotoFromAlbum: function() {
		App.app.onCaptureImage('album');
		//this.fireEvent("goToPhoto","PHOTOLIBRARY");
	},
	onGoToIssueForm: function() {	
		this.fireEvent("goToCatagoriesList");
	}
		
});

