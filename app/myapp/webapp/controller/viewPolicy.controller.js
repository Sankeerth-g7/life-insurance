sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "myapp/model/formatter",
    "sap/ui/model/odata/v2/ODataModel"
], function (Controller, JSONModel, MessageToast, formatter, ODataModel) {
    "use strict";

    return Controller.extend("myapp.controller.viewPolicy", {
        formatter: formatter,
        onInit: function () {

            var url = "/odata/v2/my/";
            this.oModel = new ODataModel(url, true);
            this.getView().setModel(this.oModel);

            this.loadPoliciesData();

            var oHeader = sap.ui.xmlfragment("myapp.view.fragments.CustomHeader", this);
            this.getView().byId("navBarPolicyContainer").addItem(oHeader);

            //var oFooter = sap.ui.xmlfragment("myapp.view.fragments.CustomFooter", this);
            //this.getView().byId("FooterviewPolicyContainer").addItem(oFooter);

        },
        // onNavHome: function () {
        //var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        //oRouter.navTo("home");
        //},

        onLogout: function () {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("home");
            MessageToast.show("Logged out!");


        },
        onNavHome: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("home");
            MessageToast.show("Returned Home");

        },

        onNavMyProfile: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("myProfile");

        },

        onNavMyPolicy: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("myPolicy");
          },
         
        loadPoliciesData: function () {
            var that = this;

            this.oModel.read("/getPolicies", {
                success: function (oData) {
                    if (oData && oData.results) {
                        var oPolicyModel = new sap.ui.model.json.JSONModel({ Policies: oData.results });
                        that.getView().setModel(oPolicyModel, "policyModel");
                    } else {
                        MessageToast.show("No policies available.");
                    }
                },
                error: function () {
                    MessageToast.show("Failed to load policies.");
                }
            });
        },


        onSelectPlan: function (oEvent) {
            var oItem = oEvent.getSource();
            var oBindingContext = oItem.getBindingContext("policyModel");
            var oPolicy = oBindingContext.getObject();
            var oView = this.getView();
            var oRouter = sap.ui.core.UIComponent.getRouterFor(oView);
            //oRouter.navTo("myProfile");


            oRouter.navTo("myProfile", {
                planName: encodeURIComponent(oPolicy.planName) // or use oPolicy.id
            });


        },

        onLogout: function () {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("home");
            MessageToast.show("Logged out!");
        }
    });
});
