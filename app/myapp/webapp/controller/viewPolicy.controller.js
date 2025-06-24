sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment", 
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "myapp/model/formatter",
    "sap/ui/model/odata/v2/ODataModel",
     "myapp/controller/footer"

], function (Controller,Fragment,  JSONModel, MessageToast,formatter,ODataModel,footerFactory ) {
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

            
    // Load Footer Fragment
        Fragment.load({
            id: this.createId("CustomFooter"),
            name: "myapp.view.fragments.CustomFooter",
            controller: this
        }).then(function (oFooterContent) {
            this.getView().byId("FooterviewPolicyContainer").addItem(oFooterContent);
        }.bind(this));

        this.footerHandler = footerFactory;
    },
    
            //  this.footerHandler = footerFactory
            // var oFooter = sap.ui.xmlfragment("myapp.view.fragments.CustomFooter", this);
            //  this.getView().byId("FooterviewPolicyContainer").addItem(oFooter);

            

        // },
        // onNavHome: function () {
        //var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        //oRouter.navTo("home");
        //},

        onLinkPress: function (oEvent) {
            this.footerHandler.onLinkPress(oEvent);
        },

        onLogout: function () {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Routelogin");
            MessageToast.show("Logged out!");


        },
        onNavHome: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("home");
            MessageToast.show("Returned Home");

        },

        onNavMyProfile: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("user");

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

                    const oModel = that.getView().getModel("policyModel");
                    const aPolicies = oModel.getProperty("/Policies");
                    oModel.setProperty("/AllPolicies", aPolicies);

                    const aTypes = Array.from(
                    new Set(aPolicies.map(p => p.policyType))
                ).map(type => ({ key: type, text: type }));
                aTypes.unshift({ key: "", text: "All Types" }); // Add "All Types" option

                oModel.setProperty("/PolicyTypes", aTypes);
                oModel.setProperty("/SelectedPolicyType", "");

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
        const sType = this.getView().byId("policyTypeSelect").getSelectedKey();
        this._filterPolicies(sQuery, sType);
    },

    onPolicyTypeChange: function(oEvent) {
    const sType = oEvent.getSource().getSelectedKey();
    console.log("Selected Policy Type:", sType);
    const sQuery = this.getView().byId("policySearchField").getValue();
    this.getView().getModel("policyModel").setProperty("/SelectedPolicyType", sType);
    this._filterPolicies(sQuery, sType);
},
    
    _filterPolicies: function (sQuery, sType) {
        const oModel = this.getView().getModel("policyModel");
        const aAllPolicies = oModel.getProperty("/AllPolicies")|| []; // Always use full list
    
        let aFiltered = aAllPolicies;
        if (sQuery) {
            const sLowerQuery = sQuery.toLowerCase();
            aFiltered = aAllPolicies.filter(policy =>
                policy.policyName.toLowerCase().includes(sLowerQuery) ||
                policy.policyType.toLowerCase().includes(sLowerQuery)
            );
        }
        
        
       if (sType && sType !== "") {
        aFiltered = aFiltered.filter(policy =>
            policy.policyType === sType
        );
    }
    
        oModel.setProperty("/Policies", aFiltered); // Update visible list
    },
onOpenFilterPopover: function (oEvent) {
    this.byId("policyTypePopover1").openBy(this.byId("filterButton1"));
},

onPopoverPolicyTypeChange: function (oEvent) {
    var sType = oEvent.getSource().getSelectedKey();
    var oSearchField = this.byId("policySearchField1");
    oSearchField.setValue(sType); // Set the selected type in the search field
    // Optionally, close the popover after selection
    this.byId("policyTypePopover1").close();

    // Trigger filtering
    this._filterPolicies(sType, sType);
},


        onSelectPlan: function (oEvent) {
            var oSelectedItem = oEvent.getSource();
            var oContext = oSelectedItem.getBindingContext("policyModel");
            var oPolicy = oContext.getObject();
            var policyId = oPolicy.policyId;
        
            // Create a JSON model with the selected policyId
            var oSelectedPolicyModel = new sap.ui.model.json.JSONModel({ policyId: policyId });
        
            // Set it on the component so it's accessible across views
            this.getOwnerComponent().setModel(oSelectedPolicyModel, "selectedPolicyModel");
        

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("myProfile");

        },
        

        onLogout: function () {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Routelogin");
            MessageToast.show("Logged out!");
        }
    });
});


