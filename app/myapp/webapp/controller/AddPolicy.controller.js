sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/ui/model/odata/v2/ODataModel"
], function (Controller, MessageToast, MessageBox, ODataModel) {
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
      var missingFields = [];
    
      function isEmpty(value) {
        return !value || value.trim().length === 0;
      }
    
      var fields = {
        policyName: oView.byId("policyName"),
        applicableAge: oView.byId("applicableAge"),
        claimAmount: oView.byId("claimAmount"),
        rateOfInterest: oView.byId("rateOfInterest"),
        selectPolicy: oView.byId("selectPolicy"),
        noOfYearsPlan: oView.byId("noOfYearsPlan"),
        enterPolicyDetails: oView.byId("enterPolicyDetails"),
        enterTermsAndConditions: oView.byId("enterTermsAndConditions")
      };
    
      Object.values(fields).forEach(function (field) {
        field.setValueState("None");
        field.setValueStateText("");
      });
    
      // Enhanced validations
      if (isEmpty(fields.policyName.getValue()) || fields.policyName.getValue().length > 255) {
        missingFields.push("Policy Name");
        fields.policyName.setValueState("Error");
        fields.policyName.setValueStateText("Please enter a valid Policy Name (max 255 characters)");
      }
    
      var age = parseInt(fields.applicableAge.getValue(), 10);
      if (isNaN(age) || age <= 0 || age > 120) {
        missingFields.push("Applicable Age");
        fields.applicableAge.setValueState("Error");
        fields.applicableAge.setValueStateText("Enter a valid age between 1 and 120");
      }
    
      var claim = parseFloat(fields.claimAmount.getValue());
      if (isNaN(claim) || claim <= 0) {
        missingFields.push("Claim Amount");
        fields.claimAmount.setValueState("Error");
        fields.claimAmount.setValueStateText("Enter a valid positive claim amount");
      }
    
      var interest = parseFloat(fields.rateOfInterest.getValue());
      if (isNaN(interest) || interest < 0 || interest > 100) {
        missingFields.push("Rate of Interest");
        fields.rateOfInterest.setValueState("Error");
        fields.rateOfInterest.setValueStateText("Enter a valid interest rate (0–100%)");
      }
    
      if (isEmpty(fields.selectPolicy.getSelectedKey())) {
        missingFields.push("Policy Type");
        fields.selectPolicy.setValueState("Error");
        fields.selectPolicy.setValueStateText("Please select a policy type");
      }
    
      var years = parseInt(fields.noOfYearsPlan.getValue(), 10);
      if (isNaN(years) || years <= 0 || years > 100) {
        missingFields.push("Number of Years Plan");
        fields.noOfYearsPlan.setValueState("Error");
        fields.noOfYearsPlan.setValueStateText("Enter a valid number of years (1–100)");
      }
    
      if (isEmpty(fields.enterPolicyDetails.getValue()) || fields.enterPolicyDetails.getValue().length > 1000) {
        missingFields.push("Policy Details");
        fields.enterPolicyDetails.setValueState("Error");
        fields.enterPolicyDetails.setValueStateText("Please enter policy details (max 1000 characters)");
      }
    
      if (isEmpty(fields.enterTermsAndConditions.getValue()) || fields.enterTermsAndConditions.getValue().length > 1000) {
        missingFields.push("Terms and Conditions");
        fields.enterTermsAndConditions.setValueState("Error");
        fields.enterTermsAndConditions.setValueStateText("Please enter terms and conditions (max 1000 characters)");
      }
    
      if (missingFields.length > 0) {
        if (missingFields.length === 1) {
          MessageBox.error("Please fill " + missingFields[0] + ".");
        } else {
          MessageBox.error("Please fill all required details");
        }
        return;
      }
    
      var oData = {
        policyId: "POL" + Date.now(),
        policyName: fields.policyName.getValue(),
        applicableAge: String(age),
        claimAmount: claim,
        Interest: interest,
        policyType: fields.selectPolicy.getSelectedKey(),
        termLength: years,
        policyDescription: fields.enterPolicyDetails.getValue(),
        termsAndConditions: fields.enterTermsAndConditions.getValue(),
        startDate: new Date().toISOString().split("T")[0]
      };
    
      var url = "/odata/v2/my/";
      this.oModel = new ODataModel(url, true);
      this.getView().setModel(this.oModel);
    
      this.oModel.create("/policies", oData, {
        success: function () {
          MessageToast.show("Policy added successfully!");
          var oRouter = sap.ui.core.UIComponent.getRouterFor(oView);
          oRouter.navTo("viewPolicy");
        },
        error: function () {
          MessageToast.show("Error while adding policy.");
        }
      });
    },
    

    onClear: function () {
      var oView = this.getView();
      var fieldIds = [
        "policyName", "applicableAge", "claimAmount", "noOfYearsPlan",
        "rateOfInterest", "selectPolicy", "enterPolicyDetails", "enterTermsAndConditions"
      ];

      fieldIds.forEach(function (id) {
        var field = oView.byId(id);
        if (field.setValue) field.setValue("");
        if (field.setSelectedKey) field.setSelectedKey(null);
        field.setValueState("None");
        field.setValueStateText("");
      });
    }
  });
});
