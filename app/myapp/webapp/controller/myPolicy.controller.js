sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageBox"
], (Controller, JSONModel, MessageToast, ODataModel, MessageBox) => {
    "use strict";

    return Controller.extend("myapp.controller.myPolicy", {
        onInit() {


            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("myPolicy").attachPatternMatched(this._onRouteMatched, this);



            var oHeader = sap.ui.xmlfragment("myapp.view.fragments.CustomHeader", this);
            this.getView().byId("navbarMyPolicyContainer").addItem(oHeader);

            //var oFooter = sap.ui.xmlfragment("myapp.view.fragments.CustomFooter", this);
            //this.getView().byId("FooterMyPoliciesContainer").addItem(oFooter);

            var url = "/odata/v2/my/";
            this.oModel = new ODataModel(url, true);
            this.getView().setModel(this.oModel);
            // var oUserModel = this.getOwnerComponent().getModel("userModel");

            
        },

        _onRouteMatched: function () {
            var oUserModel = this.getOwnerComponent().getModel("userModel");
        
            if (!oUserModel || !oUserModel.getProperty("/userId")) {
                MessageBox.warning("⚠️ Please login first", {
                    title: "Authentication Required",
                    actions: [MessageBox.Action.OK],
                    emphasizedAction: MessageBox.Action.OK,
                    onClose: function () {
                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        oRouter.navTo("Routelogin");
                    }.bind(this)
                });
                return;
            }
        
            var userId = oUserModel.getProperty("/userId");
            this.getUserPolicyDetails(userId);
        },
        


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

        onNavViewPolicy: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("viewPolicy");

        },

        onNavMyProfile: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("user");

        },

        getUserPolicyDetails: function (userId) {
            const filterCondition = `user_userId eq '${userId}'`;

            this.oModel.read("/applications", {
                urlParameters: {
                    "$filter": filterCondition,
                    "$expand": "policy"
                },
                success: (oData) => {
                    if (oData && oData.results.length > 0) {
                        const userPolicies = oData.results.map(application => ({
                            applicationId: application.applicationId,
                            applicantName: application.applicantName,
                            applicantAadhar: application.applicantAadhar,
                            applicantAddress: application.applicantAddress,
                            applicantAge: application.applicantAge,
                            applicantEmail: application.applicantEmail,
                            applicantMobileNo: application.applicantMobileNo,
                            applicantOccupation: application.applicantOccupation,
                            applicationDate: application.applicationDate,
                            documentType: application.documentType,
                            status: application.status,
                            policyId: application.policy_policyId,
                            policyDetails: application.policy
                        }));

                        // console.log(userPolicies)

                        const policyModel = new JSONModel({ userPolicies });
                        console.log(policyModel)
                        this.getView().setModel(policyModel, "policyModel");
                        // console.log(this.getView().getModel("policyModel").getProperty("/userPolicies"));

                    } else {
                        MessageToast.show("No policy details found for the given user.");
                    }
                },
                error: (oError) => {
                    MessageToast.show("Failed to load policy details.");
                    console.error("Error fetching policy details:", oError);
                }
            });
        }
    });
});
