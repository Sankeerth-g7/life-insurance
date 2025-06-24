sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment", 
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
     "myapp/controller/footer"
], function (Controller,Fragment, ODataModel, JSONModel, MessageToast, MessageBox,footerFactory) {
    "use strict";

    return Controller.extend("myapp.controller.ApplicantDetails", {
        onInit: function () {
        var oHeader = sap.ui.xmlfragment("myapp.view.fragments.AdminHeader", this);
        this.getView().byId("navbarApplicantDetailsContainer").addItem(oHeader);

            // Load Footer Fragment
      Fragment.load({
        id: this.createId("CustomFooter"),
        name: "myapp.view.fragments.CustomFooter",
        controller: this
    }).then(function (oFooterContent) {
        this.getView().byId("ApplicantDetailsFooterContainer").addItem(oFooterContent);
    }.bind(this));

    this.footerHandler = footerFactory;
// },
        
      //var oFooter = sap.ui.xmlfragment("myapp.view.fragments.CustomFooter", this);
      //this.getView().byId("ApplicantDetailsFooterContainer").addItem(oFooter);

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
                        MessageBox.error("No applicant details found.");
                    }
                },
                error: () => {
                    MessageBox.error("Failed to load applicant details.");
                }
            });
        },

        onApprove: function (oEvent) {
            const oButton = oEvent.getSource();
            const oHBox = oEvent.getSource().getParent(); // Get the parent container
            oHBox.getItems().forEach(btn => btn.setEnabled(false)); // This uses oHBox
            oButton.setEnabled(false); // Disable the Approve button
        
            const applicationId = oButton.getBindingContext("applicantDetailsModel").getProperty("applicationId");
            this.updateApplicationStatus(applicationId, "Approved");
        },
        
        onReject: function (oEvent) {
            const oButton = oEvent.getSource();
            const oHBox = oEvent.getSource().getParent(); // Get the parent container
            oHBox.getItems().forEach(btn => btn.setEnabled(false)); // This uses oHBox
            oButton.setEnabled(false); // Disable the Reject button
        
            const applicationId = oButton.getBindingContext("applicantDetailsModel").getProperty("applicationId");
            this.updateApplicationStatus(applicationId, "Rejected");
        },
        

        updateApplicationStatus: function (applicationId, status) {
            this.oModel.update(`/applications('${applicationId}')`, { status }, {
                success: () => {
                    MessageBox.success(` Application has been ${status} with the Application ID: ${applicationId}`);
                    this.loadAllApplicantDetails(); // Refresh list
                },
                error: () => {
                    MessageBox.error("Failed to update status.");
                }
            });
        },
        onAddPolicyPress: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this.getView());
            oRouter.navTo("AddPolicy");
          },
      
          onPolicyDetailsPress: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this.getView());
            oRouter.navTo("PolicyDetails");
          },
        onLogout: function () {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Routelogin");
            MessageBox.Information("Logged out!");
        },
    });
});


