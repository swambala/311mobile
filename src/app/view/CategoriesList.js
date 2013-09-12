Ext.define("App.view.CategoriesList", {
    extend: "Ext.Container",
	requires: ["Ext.List","Ext.Toolbar"],
    alias: "widget.categorieslistview",
	
    config: {
        title: 'Choose Category',
		layout: {
            type: 'fit'
        },

        items: [
			{
                xtype: "toolbar",
                docked: "top",
				title: "<p style='padding-left:45px;'>Choose Category</p>",
                items: [
                    {
                        xtype: "button",
                        ui: "back",
                        text: "Back",
                        itemId: "backButtonFromCategoriesList"
                    },
                    { xtype: "spacer" }
				]
            },{
				xtype: 'list',
				cls:'boxlist',
				itemId: 'categoriesList',
				store: "Categories",
				itemTpl: '{service_name}',
				onItemDisclosure: true
			}
        ],

        record: null,
        listeners: [
			{
				delegate: "#categoriesList",
				event: "itemtap",
				fn: "categoryItemTab"
			},{
				delegate: "#categoriesList",
				event: "disclose",
				fn: "categoryItemSingleDisclose"
			},
            {
                delegate: "#backButtonFromCategoriesList",
                event: "tap",
                fn: "onBackButtonTapFromCategoriesList"
            }
        ]
    },
    categoryItemTab: function(DataView, index, target, record, e, eOpts) {
		this.nextPageofromCategoriesList(record.data.service_code,record.data.service_name);
	},
	categoryItemSingleDisclose: function(DataView, record, target, index, e, eOpts) {
		this.nextPageofromCategoriesList(record.data.service_code,record.data.service_name);
	},
	nextPageofromCategoriesList: function(service_code,service_name) {
		this.fireEvent("newTicketCommand",service_code,service_name);
	},
    onBackButtonTapFromCategoriesList: function () {
		this.fireEvent("backFromCategoriesListCommand", this);
    }
});

