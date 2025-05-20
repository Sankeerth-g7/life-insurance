sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("myapp.controller.myPolicies", {
        onInit() {
            
  var oHeader = sap.ui.xmlfragment("myapp.view.fragments.CustomHeader", this);
    this.getView().byId("navbarMyPoliciesContainer").addItem(oHeader);

            // Simulating getting authenticated userId (Replace this with actual authentication logic)
            const userIdd = "1"; 

            // API endpoint to fetch applications filtered by userId
            const apiUrl = `https://port4004-workspaces-ws-b9xtw.us10.trial.applicationstudio.cloud.sap/odata/v4/my/applications?$expand=user,policy&$filter=user/userId eq '${userIdd}'`


            // Fetch data from API
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    const oModel = new JSONModel(data);
                    this.getView().setModel(oModel);
                })
                .catch(error => console.error("Error fetching applications:", error));
        }
    });
});
