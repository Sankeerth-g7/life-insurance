sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("myapp.controller.viewPolicy", {
        onInit: function () {
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.loadData("model/policies.json");
            this.getView().setModel(oModel, "policyModel");
        },
        
        onSelectPlan: function (oEvent) {
            var oCard = oEvent.getSource().getParent();
            var sTitle = oCard.getItems()[0].getText();
            MessageToast.show("You selected: " + sTitle);
        }
    });
});
