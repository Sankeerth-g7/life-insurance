sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment", 
     "sap/ui/model/odata/v2/ODataModel",
     "myapp/model/formatter",
     "sap/m/MessageToast",
     "sap/m/MessageBox",
     "myapp/controller/footer"
  ], function (Controller,Fragment,  ODataModel,formatter,MessageToast, MessageBox,footerFactory) {
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

          // Load Footer Fragment
      Fragment.load({
        id: this.createId("CustomFooter"),
        name: "myapp.view.fragments.CustomFooter",
        controller: this
    }).then(function (oFooterContent) {
        this.getView().byId("PolicyDetailsFooterContainer").addItem(oFooterContent);
    }.bind(this));

    this.footerHandler = footerFactory;
},

          //var oFooter = sap.ui.xmlfragment("myapp.view.fragments.CustomFooter", this);
      //this.getView().byId("PolicyDetailsFooterContainer").addItem(oFooter);
        // },
        loadPoliciesData: function () {
          var that = this;

          this.oModel.read("/getPolicies", {
            success: function (oData) {
                if (oData && oData.results) {
                    var oPolicyModel = new sap.ui.model.json.JSONModel({ Policies: oData.results });
                    that.getView().setModel(oPolicyModel, "policyModel");
            
                    const oModel = that.getView().getModel("policyModel");
                    const aPolicies = oModel.getProperty("/Policies");
                    oModel.setProperty("/AllPolicies", aPolicies); // Save original data
                } else {
                    MessageToast.show("No policies available.");
                }
            },
            
              error: function () {
                MessageBox.error("Failed to load policies.");
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
    
    _filterPolicies: function (sQuery) {
        const oModel = this.getView().getModel("policyModel");
        const aAllPolicies = oModel.getProperty("/AllPolicies"); // Always use full list
    
        let aFiltered = aAllPolicies;
        if (sQuery) {
            const sLowerQuery = sQuery.toLowerCase();
            aFiltered = aAllPolicies.filter(policy =>
                policy.policyName.toLowerCase().includes(sLowerQuery) ||
                policy.policyType.toLowerCase().includes(sLowerQuery)
            );
        }
    
        oModel.setProperty("/Policies", aFiltered); // Update visible list
    },
    
    
    onDeletePolicy: function (oEvent) {
        var oItemContext = oEvent.getSource().getBindingContext("policyModel");
        var oPolicy = oItemContext.getObject();
        var sPolicyId = oPolicy.policyId; // Adjust if your key is named differently
    
        var sPath = "/getPolicies('" + sPolicyId + "')"; // OData entity path
        var that = this;
    
        // Show confirmation dialog
        MessageBox.information("Are you sure you want to delete this policy?", {
            title: "Confirm Deletion",
            actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
            onClose: function (oAction) {
                if (oAction === sap.m.MessageBox.Action.YES) {
                    that.oModel.remove(sPath, {
                        success: function () {
                            MessageBox.success("Policy deleted successfully.");
                            that.loadPoliciesData(); // Refresh the list
                        },
                        error: function () {
                            MessageBox.error("Failed to delete policy.");
                        }
                    });
                }
            }
        });
    },
    
    onEditPolicy: function (oEvent) {
        var oItemContext = oEvent.getSource().getBindingContext("policyModel");
        var oPolicy = oItemContext.getObject();
    
        // Store the selected policy in a global model or pass via navigation
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        var oPolicyModel = new sap.ui.model.json.JSONModel(oPolicy);
        this.getOwnerComponent().setModel(oPolicyModel, "editPolicy");
    
        // Navigate to AddPolicy view
        oRouter.navTo("AddPolicy");
    },
    onAddPolicyPress: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this.getView());
        oRouter.navTo("AddPolicy");
      },
  
      onPolicyDetailsPress: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this.getView());
        oRouter.navTo("PolicyDetails");
      },
      onApplicantDetailsPress: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this.getView());
        oRouter.navTo("ApplicantDetails");
      },
    onLogout: function () {

        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("Routelogin");
        MessageToast.show("Logged out!");
    }, 
    
    });
  });

  