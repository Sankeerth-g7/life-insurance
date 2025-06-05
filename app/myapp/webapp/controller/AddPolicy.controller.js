sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/ui/model/odata/v2/ODataModel"
], function (Controller, MessageToast, ODataModel) {
  "use strict";

  return Controller.extend("myapp.controller.AddPolicy", {
      onInit: function () {
          var oHeader = sap.ui.xmlfragment("myapp.view.fragments.AdminHeader", this);
          this.getView().byId("navbarAddPolicyContainer").addItem(oHeader);

          var oFooter = sap.ui.xmlfragment("myapp.view.fragments.CustomFooter", this);
            this.getView().byId("FooterContainer").addItem(oFooter);
      },

      onAddPolicy: function () {
          var oView = this.getView();
          var url = "/odata/v2/my/";
          this.oModel = new ODataModel(url, true);
          this.getView().setModel(this.oModel);

          // Collect form data
          var oData = {
            policyId: "POL" + Date.now(),
            policyName: oView.byId("policyName").getValue(),
            applicableAge: oView.byId("applicableAge").getValue(),
            claimAmount: parseFloat(oView.byId("claimAmount").getValue()),
            Interest: parseFloat(oView.byId("rateOfInterest").getValue()),
            policyType: oView.byId("policyType").getSelectedKey(),
            termLength: parseInt(oView.byId("noOfYearsPlan").getValue(), 10),
            policyDescription: oView.byId("enterPolicyDetails").getValue(),
            termsAndConditions: oView.byId("enterTermsAndConditions").getValue(),
            startDate: new Date().toISOString().split("T")[0]
        };
        
        

          // Call OData create
          this.oModel.create("/policies", oData, {
              success: function () {
                  MessageToast.show("Policy added successfully!");
                  var oRouter = sap.ui.core.UIComponent.getRouterFor(oView);
                  oRouter.navTo("home");
              },
              error: function () {
                  MessageToast.show("Error while adding policy.");
              }
          });
         
      },
      onClear: function () {
        var oView = this.getView();
    
        // Clear Input Fields
        oView.byId("policyName").setValue("");
        oView.byId("applicableAge").setValue("");
        oView.byId("claimAmount").setValue("");
        oView.byId("noOfYearsPlan").setValue("");
        oView.byId("rateOfInterest").setValue("");
    
        // Clear Select Field
        oView.byId("policyType").setSelectedKey("");
    
        // Clear TextAreas
        oView.byId("enterPolicyDetails").setValue("");
        oView.byId("enterTermsAndConditions").setValue("");
    }
    
  });
});
