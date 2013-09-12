Ext.define("App.view.ThanksPage", {
    extend: "Ext.Container",
	requires: ["Ext.Toolbar"],
    alias: "widget.thankspageview",
	
    config: {
        title: 'Thank You',
        layout: 'vbox',
		 items: [
			{
				xtype: "toolbar",
				title: "<p style='padding-left:15px;color:#FFDB0A;'>Thank You</p>",
				docked: "top",
				margin:0,
				items: [
					{ xtype: 'spacer' },{
						xtype: "button",
						ui: "save",
						text: "Done",
						itemId: "backtoMainPanel"
					}
				]
			},{
                xtype: "container",
                docked: "bottom",
				height:'100%',
				style:'background-color:#FFC000;',
				items: [
					{
						xtype: 'container',
						style:'padding-left:5%;',
						html: '<p>Thank You for helping me make Sunshine even better.</p>',
						flex:1						
					},
					{
						xtype: 'container',
						width:"100%",
						height:"70%",
						items:[
						{
							html:'<br/>Mayor Abdul Kalam<br/>&nbsp;',
							style:'padding-left:45%;'
						},{
							xtype: 'image',
							width:'60%',
							height:'60%',
							style:'padding-left:45%;float:right;',
							src: 'resources/images/abdulkalam.jpg'
						}]
					}
                ]
            }
        ],		
        record: null,
        listeners: [
			{
                delegate: "#backtoMainPanel",
                event: "tap",
                fn: "backtoMainPanel"
            }
        ]
    },
	backtoMainPanel: function() {
		this.fireEvent("backtoMainPanel", this);
	}
});

