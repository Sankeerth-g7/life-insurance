sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "myapp/model/formatter"
], function (Controller, JSONModel, MessageToast,formatter) {
    "use strict";

    return Controller.extend("myapp.controller.viewPolicy", {
        formatter: formatter,
        onInit: function () {
            this.loadPoliciesData();
        },

        loadPoliciesData: async function () {
            var oModel = new JSONModel();
            var that = this;
            
            $.ajax({
                url: "/odata/v4/my/getPolicies",
                type: "GET",
                success: function (data) {
                    if (data && data.value) {
                        oModel.setData({ Policies: data.value }); // Store only 'value' array
                        that.getView().setModel(oModel, "policyModel");
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
            
            MessageToast.show("You selected: " + oPolicy.policyName);
        }
    });
});
