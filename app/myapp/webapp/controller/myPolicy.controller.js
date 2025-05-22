sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v2/ODataModel"
], (Controller, JSONModel, MessageToast, ODataModel) => {
    "use strict";

    return Controller.extend("myapp.controller.myPolicy", {
        onInit() {
            

            var oHeader = sap.ui.xmlfragment("myapp.view.fragments.CustomHeader", this);
            this.getView().byId("navbarMyPoliciesContainer").addItem(oHeader);

            var oFooter = sap.ui.xmlfragment("myapp.view.fragments.CustomFooter", this);
            this.getView().byId("FooterMyPoliciesContainer").addItem(oFooter);

            var url = "/odata/v2/my/";
            this.oModel = new ODataModel(url, true);
            this.getView().setModel(this.oModel);

            this.oModel.attachMetadataLoaded(() => {
                this.getUserPolicyDetails("1"); // Ensure metadata is loaded before calling API
            });
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

                        console.log(userPolicies)

                        const policyModel = new JSONModel({ userPolicies });
                        this.getView().setModel(policyModel, "policyModel");
                        console.log(this.getView().getModel("policyModel").getProperty("/userPolicies"));

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
