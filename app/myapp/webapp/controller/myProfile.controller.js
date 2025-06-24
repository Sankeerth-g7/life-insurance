sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment", 
  "sap/m/MessageBox",
  "sap/m/MessageToast",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/odata/v2/ODataModel",
   "myapp/controller/footer"
], (Controller,Fragment, MessageBox, MessageToast, JSONModel, ODataModel,footerFactory) => {
  "use strict";

  return Controller.extend("myapp.controller.myprofile", {
    onInit() {
 
      // Initialize the model
      var url = "/odata/v2/my/";
      this.oModel = new ODataModel(url, true);
      this.getView().setModel(this.oModel);
 
      var oHeader = sap.ui.xmlfragment("myapp.view.fragments.CustomHeader", this);
      this.getView().byId("navbarmyProfileContainer").addItem(oHeader);
      // Load Footer Fragment
      Fragment.load({
        id: this.createId("CustomFooter"),
        name: "myapp.view.fragments.CustomFooter",
        controller: this
    }).then(function (oFooterContent) {
        this.getView().byId("FootermyProfileContainer").addItem(oFooterContent);
    }.bind(this));

    this.footerHandler = footerFactory;

     //get userId and policyId usin omodel also need to check if user is logged in or notAdd commentMore actions

      
},
      // this.footerHandler = footerFactory
      // var oFooter = sap.ui.xmlfragment("myapp.view.fragments.CustomFooter", this);
      //       this.getView().byId("FootermyProfileContainer").addItem(oFooter);
            
      //   var oHeader = sap.ui.xmlfragment("myapp.view.fragments.CustomHeader", this);
      //     this.getView().byId("navbarProfileContainer").addItem(oHeader);

      //var oFooter = sap.ui.xmlfragment("myapp.view.fragments.CustomFooter", this);
      //this.getView().byId("FootermyProfileContainer").addItem(oFooter);
      //this.getview().byId("FootermyProfileContainer").addItem(oFooter);
      
    // },

    onSubmit: function () {

      var oUserModel = this.getOwnerComponent().getModel("userModel");
      var userId = oUserModel.getProperty("/userId");
      console.log(userId);

      var oSelectedPolicyModel = this.getOwnerComponent().getModel("selectedPolicyModel");
      var policyId = oSelectedPolicyModel.getProperty("/policyId");
      console.log(policyId)
      // Capturing the data in variables
      var ApplicantName = this.getView().byId("enterApplicantName").getValue();
      var ApplicantAddress = this.getView().byId("enterApplicantAddress").getValue();
      var ApplicantMobileNo = this.getView().byId("enterApplicantMobileNo").getValue();
      var ApplicantEmailId = this.getView().byId("enterEmailId").getValue();
      var ApplicantPanNo = this.getView().byId("enterPanNo").getValue();
      var ApplicantAge = this.getView().byId("entertheapplicantage").getValue();
 
      var ApplicantAadharNo = this.getView().byId("enterAadhaarNo").getValue();
 
      // Log the captured data for debugging
      console.log("Applicant Name:", ApplicantName);
      console.log("Applicant Address:", ApplicantAddress);
      console.log("Applicant Mobile No:", ApplicantMobileNo);
      console.log("Applicant Email Id:", ApplicantEmailId);
      console.log("Aadhar No:", ApplicantAadharNo);
      console.log("Pan No:", ApplicantPanNo);
      console.log("Age:", ApplicantAge);
 
 
      // Validation formats
      var nameFormat = /^[a-zA-Z\s]+$/;
      var mobileFormat = /^[0-9]{10}$/;
      var emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      var aadhaarFormat = /^[0-9]{12}$/;
      var panFormat = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      var ageFormat = /^(1[89]|[2-5][0-9]|6[0-5])$/;
 
 
      function generateInsuranceId() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensures two digits
        const randomTwoDigit = Math.floor(10 + Math.random() * 90); // Random number between 10 and 99
        return `${year}-${month}-${randomTwoDigit}`;
      }
      
 
 
      // Example usage:
      const appName = "Insurance Loan";
      const randomString = generateInsuranceId();
      // Output: 2025-myApp-1234 (example)
 
      // Storing the generated string in a variable
      const LoanId = randomString;
 
      // You can now use 'storedString' wherever needed
      console.log(LoanId);
 
      // Creating new object
      var NewUser = {
        user_userId: userId,
        policy_policyId: policyId,
        applicantName: ApplicantName,
        applicantAddress: ApplicantAddress,
        applicantMobileNo: ApplicantMobileNo,
        applicantEmail: ApplicantEmailId,
        applicantAadhar: ApplicantAadharNo,
        applicantPan: ApplicantPanNo,
        applicantAge: ApplicantAge,
        applicationId: LoanId,
        status: "Pending",
        documentFileName: this._file?.name || "",
        documentMimeType: this._file?.type || "",
        documentContent: this.filebase64String || ""
 
 
      };
 
 
      let formatErrors = [];
      if (ApplicantName && !ApplicantName.match(nameFormat)) formatErrors.push("Applicant name (only alphabets are allowed)");
      if (ApplicantMobileNo && !ApplicantMobileNo.match(mobileFormat)) formatErrors.push("Applicant Mobile No (Must be 10 digits)");
      if (ApplicantEmailId && !ApplicantEmailId.match(emailFormat)) formatErrors.push("Applicant Email Id (Invalid email format)");
      if (ApplicantAadharNo && !ApplicantAadharNo.match(aadhaarFormat)) formatErrors.push("Applicant Aadhaar No (Must be 12 digits)");
      if (ApplicantPanNo && !ApplicantPanNo.match(panFormat)) formatErrors.push("Applicant Pan No (Must be 12 digits)");
      if (ApplicantAge && !ApplicantAge.match(ageFormat)) formatErrors.push("Applicant Age (only numbers allowed)");
 
      if (!this._file || !this._file.name) formatErrors.push("Document file must be uploaded");
      if (!this.filebase64String) formatErrors.push("Document content is missing");
 
 
      // if (formatErrors.length > 0) {
      //   sap.m.MessageBox.error("Please correct the following fields:\n" + formatErrors.join("\n"));
      //   return;
      // }
 
      // Missing fields
 
      var DocumentType = this.getView().byId("selectDocumentType").getSelectedKey();
      var FilePath = this.getView().byId("filePath").getValue();
 
      let missingFields = [];
      if (!ApplicantName) missingFields.push("Applicant Name");
      if (!ApplicantAddress) missingFields.push("Applicant Address");
      if (!ApplicantMobileNo) missingFields.push("Applicant Mobile No");
      if (!ApplicantAadharNo) missingFields.push("Applicant Aadhar No");
      if (!ApplicantPanNo) missingFields.push("Applicant Pan No");
      if (!ApplicantEmailId) missingFields.push("Applicant Email Id");
      if (!FilePath) missingFields.push("Uploaded File");
      if (!ApplicantAge) missingFields.push("Applicant Age");
 
 
      const totalFields = 8;
 
      if (missingFields.length >= totalFields) {
        sap.m.MessageBox.error("Please fill the form.");
        return;
      } else if (missingFields.length > 0) {
        sap.m.MessageBox.error("Please fill the required fields:\n" + missingFields.join("\n"));
        return;
      }
 
 
 
 
 
      this.oModel.create("/applications", NewUser, {
        success: function (data) {
          MessageBox.success("You have applied for insurance successfully\nYour insurance id: " + LoanId, {
            onClose: function () {
              var oView = this.getView();
              oView.byId("enterApplicantName").setValue("");
              oView.byId("enterApplicantAddress").setValue("");
              oView.byId("enterApplicantMobileNo").setValue("");
              oView.byId("enterEmailId").setValue("");
              oView.byId("enterAadhaarNo").setValue("");
              oView.byId("selectDocumentType").setValue("");
              oView.byId("filePath").setValue("");
              oView.byId("enterPanNo").setValue("");
              oView.byId("entertheapplicantage").setValue("");
              var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
              oRouter.navTo("viewPolicy");
 
            }.bind(this)
          });

          // Trigger confirmation email via CAP endpoint
          this.oModel.callFunction("/sendApplicationConfirmation", {
            method: "POST",
            urlParameters: {
              userId: NewUser.user_userId,
              applicationId: NewUser.applicationId
            },
            success: function (oData) {
              sap.m.MessageToast.show("Confirmation email sent to your registered email.");
            },
            error: function (oError) {
              sap.m.MessageToast.show("Failed to send confirmation email.");
            }
          });

        }.bind(this),
        
        error: function (oError) {
          var errorMessage = oError.responseText ? JSON.parse(oError.responseText).error.message : "Unexpected error occurred.";
          MessageToast.show("Error submitting: " + errorMessage);
        }
      });
 
    },
    
 
    onCancel() {
      sap.m.MessageToast.show("Loan application cancelled");
 
    },
 
    onChooseFile: function () {
      var oFileUploader = document.createElement('input');
      oFileUploader.type = 'file';
      oFileUploader.onchange = function (event) {
        var file = event.target.files[0];
        this._file = file;
        var oFilePathInput = this.byId("filePath");
        oFilePathInput.setValue(file.name);
 
      }.bind(this);
      oFileUploader.click();

          },
          onUpload: function () {
            var file = this._file;
            if (!file) {
              sap.m.MessageToast.show("Please choose a file first.");
              return;
            }
            var filename = file.name;
            var filesize = file.size;
            var extension = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
            if (!["pdf", "jpg", "jpeg"].includes(extension)) {
              sap.m.MessageToast.show("Kindly upload only PDF files");
              return;
            } else if (filesize > 2000000) {
              sap.m.MessageToast.show("File size should not be more than 2MB.");
              return;
            }
            var reader = new FileReader();
            reader.onload = function (e) {
              // Convert ArrayBuffer to base64 string
              var binary = '';
              var bytes = new Uint8Array(e.target.result);
              var len = bytes.byteLength;
              for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              var base64Stringfile = btoa(binary);
              var oModel = this.getView().getModel("mainModel");
              oModel.callFunction("/uploadDocument", {
                method: "POST",
                urlParameters: {
                  fileName: file.name,
                  fileContent: base64Stringfile
                },
                success: function (data) {
                  this.documentUrl = data.uploadDocument;
                  sap.m.MessageToast.show("File uploaded successfully.");
                }.bind(this),
                error: function (err) {
                  sap.m.MessageBox.error("File upload failed. Please try again.");
                }
              });
            }.bind(this);
            reader.readAsArrayBuffer(file);
          },

    onClear: function () {
      this.byId("enterApplicantName").setValue("");
      this.byId("enterApplicantAddress").setValue("");
      this.byId("enterApplicantMobileNo").setValue("");
      this.byId("enterEmailId").setValue("");
      this.byId("selectDocumentType").setSelectedKey(null);
      this.byId("filePath").setSelectedKey(null);
      this.byId("entertheapplicantage").setValue("");
      this.byId("enterAadhaarNo").setValue("");
      this.byId("enterPanNo").setValue("");
 
 
 
 
    },
    nameValidation: function (oEvent) {
      var fieldValue = oEvent.getSource().getValue();
      var fieldName = oEvent.getSource();
      var format = (/^[a-zA-Z\s]+$/);
      var blen = fieldValue.length;
 
      if (blen == 50) {
        fieldName.setValueState(sap.ui.core.ValueState.Error);
        fieldName.setValueStateText("More Than 50 Characters Not Accepted");
      } else if (!fieldValue.match(format)) {
        fieldName.setValueState(sap.ui.core.ValueState.Error);
        fieldName.setValueStateText("Only Alphabets can Accepted");
      } else {
        fieldName.setValueState(sap.ui.core.ValueState.None);
      }
    },
    numValidation: function (oEvent) {
      var fieldValue = oEvent.getSource().getValue();
      var fieldName = oEvent.getSource();
      var format = (/^[0-9]{10}$/);
      var blen = fieldValue.length;
 
      if (blen !== 10) {
        fieldName.setValueState(sap.ui.core.ValueState.Error);
        fieldName.setValueStateText("Mobile number must be 10 digits");
      } else if (!fieldValue.match(format)) {
        fieldName.setValueState(sap.ui.core.ValueState.Error);
        fieldName.setValueStateText("Only Numbers can Accepted");
      } else {
        fieldName.setValueState(sap.ui.core.ValueState.None);
      }
    },
    emailValidation: function (oEvent) {
      var fieldValue = oEvent.getSource().getValue();
      var fieldName = oEvent.getSource();
      var format = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 
      if (!fieldValue.match(format)) {
        fieldName.setValueState(sap.ui.core.ValueState.Error);
        fieldName.setValueStateText("Invalid email address");
 
      } else {
        fieldName.setValueState(sap.ui.core.ValueState.None);
      }
    },
    aadharValidation: function (oEvent) {
      var fieldValue = oEvent.getSource().getValue();
      var fieldName = oEvent.getSource();
      var format = /^[0-9]{12}$/;
   
      if (!fieldValue.match(format)) {
        fieldName.setValueState(sap.ui.core.ValueState.Error);
        fieldName.setValueStateText("Aadhaar number must be exactly 12 digits");
       
      } else {
        fieldName.setValueState(sap.ui.core.ValueState.None);
      }
    },
    panValidation: function (oEvent) {
      var fieldValue = oEvent.getSource().getValue();
      var fieldName = oEvent.getSource();
      var format = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      var blen = fieldValue.length;
 
      if (blen !== 10) {
        fieldName.setValueState(sap.ui.core.ValueState.Error);
        fieldName.setValueStateText("Pan number must be 10 digits");
      } else if (!fieldValue.match(format)) {
        fieldName.setValueState(sap.ui.core.ValueState.Error);
        fieldName.setValueStateText("Invalid Pan number");
      } else {
        fieldName.setValueState(sap.ui.core.ValueState.None);
      }
    },
    ageValidation: function (oEvent) {
      var fieldValue = oEvent.getSource().getValue();
      var fieldName = oEvent.getSource();
      var format = /^(0?[1-9]|[1-9][0-9])$/; // Matches 1–99
   
      if (!fieldValue.match(format)) {
        fieldName.setValueState(sap.ui.core.ValueState.Error);
        fieldName.setValueStateText("Age must be a number between 1 and 99");
       
      } else {
        fieldName.setValueState(sap.ui.core.ValueState.None);
      }
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
      oRouter.navTo("myProfile");
 
    },
 
    onNavMyPolicy: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("myPolicy");
    },
    onNavViewPolicy: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("viewPolicy");
 
    },
  });
});

