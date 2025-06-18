sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, ODataModel, JSONModel, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("myapp.controller.ApplicantDetails", {
        onInit: function () {

        var oHeader = sap.ui.xmlfragment("myapp.view.fragments.AdminHeader", this);
      this.getView().byId("navbarAplicationDetailsContainer").addItem(oHeader);

      var oFooter = sap.ui.xmlfragment("myapp.view.fragments.CustomFooter", this);
      this.getView().byId("ApplicationDetailsFooterContainer").addItem(oFooter);

            var url = "/odata/v2/my/";
            this.oModel = new ODataModel(url, true);
            this.getView().setModel(this.oModel);
            this.loadAllApplicantDetails();
        },

            loadAllApplicantDetails: function () {
                   this.oModel.read("/applications", {
                urlParameters: {
                    "$expand": "policy"
                },
                success: (oData) => {
                    if (oData.results && oData.results.length > 0) {
                        const applicantDetails = oData.results.map(application => ({
                            applicationId: application.applicationId,
                            applicantName: application.applicantName,
                            applicantEmail: application.applicantEmail,
                            applicantMobileNo: application.applicantMobileNo,
                            status: application.status,
                            policyName: application.policy?.policyName,
                            claimAmount: application.policy?.claimAmount,
                            termLength: application.policy?.termLength
                        }));

                        const applicantDetailsModel = new JSONModel({ applicantDetails });
                        this.getView().setModel(applicantDetailsModel, "applicantDetailsModel");
                    } else {
                        MessageToast.show("No applicant details found.");
                    }
                },
                error: () => {
                    MessageToast.show("Failed to load applicant details.");
                }
            });
        },

        onApprove: function (oEvent) {
            const applicationId = oEvent.getSource().getBindingContext("applicantDetailsModel").getProperty("applicationId");
            this.updateApplicationStatus(applicationId, "Approved");
        },

        onReject: function (oEvent) {
            const applicationId = oEvent.getSource().getBindingContext("applicantDetailsModel").getProperty("applicationId");
            this.updateApplicationStatus(applicationId, "Rejected");
        },

        updateApplicationStatus: function (applicationId, status) {
            this.oModel.update(`/applications('${applicationId}')`, { status }, {
                success: () => {
                    MessageToast.show(`Application ${status}`);
                    this.loadAllApplicantDetails(); // Refresh list
                },
                error: () => {
                    MessageToast.show("Failed to update status.");
                }
            });
        }
    });
});
