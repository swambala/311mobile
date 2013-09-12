Ext.define("App.view.MainPanel", {
    extend: "Ext.Container",
	requires: ["Ext.Map","Ext.List","Ext.Toolbar"],
    alias: "widget.mainpanelview",
	
    config: {
        title: 'Citizen',
        baseCls: 'x-show-contact',
		layout: 'vbox',
		 items: [
			{
				xtype: 'image',
				flex:1,
				width:'100%',
				height:'100%',
				src: 'resources/icons/newyork.jpg'
			},
			{
                xtype: "container",
                docked: "bottom",
				height:'30%',
				style:'background-color:#FFC000;',
				items: [
					{
						xtype: "button",
						ui:'secondary',
						margin: '4%',
						itemId:'newIssueBtn',
						text: 'Report an Issue',
						iconMask: true
					},
					{
						xtype: "button",
						ui:'secondary',
						margin: '4%',
						itemId:'reportedIssuesBtn',
						text:'Show Reported Issues',
						iconMask: true
					}
                ]
            },
			{ 
				xtype: "container",
				docked: "bottom",
				height:'10%',
				style:'background-color:#FFC000;' 
			}
        ],

		
        record: null,
        listeners: [
			{
                delegate: "#reportedIssuesBtn",
                event: "tap",
                fn: "onReportedIssuesList"
            },
			{
                delegate: "#newIssueBtn",
                event: "tap",
                fn: "onNewIssue"
            }
        ]
    },
	onReportedIssuesList: function() {
		App.app.setCitizenParams.nearBy = '';
		this.fireEvent("issuesListCommand", this);
           myMask = new Ext.LoadMask(Ext.getBody(), {message:"Loading Tickets..."});
           myMask.show();
           timeout = setTimeout(App.app.onHideMask, 3500);
	},
	onNewIssue: function() {
		App.app.setCitizenParams.capturePageFrom = '';
		App.app.setCitizenParams.address =  '';
		App.app.setCitizenParams.message = '';
		this.fireEvent("newIssueCommand", this);
	}
});

