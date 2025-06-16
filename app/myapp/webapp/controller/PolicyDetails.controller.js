sap.ui.define([
    "sap/ui/core/mvc/Controller",
     "sap/ui/model/odata/v2/ODataModel",
     "myapp/model/formatter",
  ], function (Controller,  ODataModel,formatter) {
    "use strict";
  
    return Controller.extend("myapp.controller.PolicyDetails", {
      formatter: formatter,
        onInit() {
          var url = "/odata/v2/my/";
          this.oModel = new ODataModel(url, true);
          this.getView().setModel(this.oModel);

          this.loadPoliciesData();

          var oHeader = sap.ui.xmlfragment("myapp.view.fragments.AdminHeader", this);
          this.getView().byId("navbarPolicyDetailsContainer").addItem(oHeader);
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

      onSearchPolicy: function(oEvent) {
        const sQuery = oEvent.getParameter("newValue");
        this._filterPolicies(sQuery);
    },
    
    onSearchPolicyButton: function() {
        const sQuery = this.getView().byId("policySearchField").getValue();
        this._filterPolicies(sQuery);
    },
    
    _filterPolicies: function(sQuery) {
        const oListBinding = this.getView().byId("policyFlexBox").getBinding("items");
        if (sQuery) {
            const oFilter = new sap.ui.model.Filter({
                filters: [
                    new sap.ui.model.Filter("policyName", sap.ui.model.FilterOperator.Contains, sQuery),
                    new sap.ui.model.Filter("policyType", sap.ui.model.FilterOperator.Contains, sQuery)
                ],
                and: false
            });
            oListBinding.filter([oFilter]);
        } else {
            oListBinding.filter([]);
        }
    }
    
    });
  });