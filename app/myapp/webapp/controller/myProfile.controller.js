sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "sap/m/MessageToast",
  "sap/ui/model/json/JSONModel"
], (Controller, MessageBox,MessageToast, JSONModel) => {
    "use strict";
 
    return Controller.extend("myapp.controller.profile", {
      onInit() {
 
        // Initialize the model
        var oModel = new JSONModel("odata/v4/my/applications");
        this.getView().setModel(oModel);
        
        var oHeader = sap.ui.xmlfragment("myapp.view.fragments.CustomHeader", this);
        this.getView().byId("navbarmyProfileContainer").addItem(oHeader);
//   var oHeader = sap.ui.xmlfragment("myapp.view.fragments.CustomHeader", this);
//     this.getView().byId("navbarProfileContainer").addItem(oHeader);

        var oFooter = sap.ui.xmlfragment("myapp.view.fragments.CustomFooter", this);
        this.getView().byId("FooterProfileContainer").addItem(oFooter);
     
    },
    onSubmit: function() {
      // Capturing the data in variables
      var ApplicantName = this.getView().byId("enterApplicantName").getValue();
      var ApplicantAddress = this.getView().byId("enterApplicantAddress").getValue();
      var ApplicantMobileNo = this.getView().byId("enterApplicantMobileNo").getValue();
      var ApplicantEmailId = this.getView().byId("enterEmailId").getValue();
      var ApplicantAadharNo = this.getView().byId("enterAadhaarNo").getValue();
      var ApplicantPanNo = this.getView().byId("enterPanNo").getValue();
      var ApplicantAge = this.getView().byId("entertheapplicantage").getValue();
      var ApplicationId = this.getView().byId("applicationid").getValue();
  
      // Log the captured data for debugging
      console.log("Applicant Name:", ApplicantName);
      console.log("Applicant Address:", ApplicantAddress);
      console.log("Applicant Mobile No:", ApplicantMobileNo);
      console.log("Applicant Email Id:", ApplicantEmailId);
      console.log("Aadhar No:", ApplicantAadharNo);
      console.log("Pan No:", ApplicantAadharNo);
      console.log("Age:", ApplicantAge);
      console.log("Application id:", ApplicationId);
  
      // Validation formats
      var nameFormat = /^[a-zA-Z\s]+$/;
      var mobileFormat = /^[0-9]{10}$/;
      var emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      var aadhaarFormat = /^[0-9]{12}$/;
      var panFormat = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      var ageFormat = /^(1[89]|[2-5][0-9]|6[0-5])$/;
      var IdFormat = /^[0-9]*$/; // Correctly define the format
  
      // Generate loan id
      function generateLoanId() {
          const currentYear = new Date().getFullYear();
          const randomNumber = Math.floor(Math.random() * 10000); // Generates a random number between 0 and 9999
          return `${currentYear}-${appName}-${randomNumber}`;
      }
  
      // Example usage:
      const appName = "Insurance Loan";
      const randomString = generateLoanId();
      // Output: 2025-myApp-1234 (example)
  
      // Storing the generated string in a variable
      const LoanId = randomString;
  
      // You can now use 'storedString' wherever needed
      console.log(LoanId);
  
      // Creating new object
      var NewUser = {
          applicantName: ApplicantName,
          applicantAddress: ApplicantAddress,
          applicantMobileNo: ApplicantMobileNo,
          applicantEmail: ApplicantEmailId,
          applicantAadhar: ApplicantAadharNo,
          applicantPan: ApplicantPanNo,
          applicantAge: ApplicantAge,
          applicationId: ApplicationId,
          // doucument: this.filebase64String,
          // Id: LoanId
      };
  
      // Checking for wrong format
      let formatErrors = [];
      if (!ApplicantName.match(nameFormat)) formatErrors.push("Applicant name (only alphabets are allowed)");
      if (!ApplicantMobileNo.match(mobileFormat)) formatErrors.push("Applicant Mobile No (Must be 10 digits)");
      if (!ApplicantEmailId.match(emailFormat)) formatErrors.push("Applicant Email Id (Invalid email format)");
      if (!ApplicantAadharNo.match(aadhaarFormat)) formatErrors.push("Applicant Aadhaar No (Must be 12 digits)");
      if (!ApplicantPanNo.match(panFormat)) formatErrors.push("Applicant Pan No (Must be 12 digits)");
      if (!ApplicantAge.match(ageFormat)) formatErrors.push("Applicant Age (only numbers allowed)");
      if (!ApplicationId.match(IdFormat)) formatErrors.push("Application id (only Numbers are allowed)");
  
      if (formatErrors.length > 0) {
          sap.m.MessageBox.error("Please correct the following fields:\n" + formatErrors.join("\n"));
          return;
      }
  
      // Missing fields
      let missingFields = [];
      if (!ApplicantName) missingFields.push("Applicant Name");
      if (!ApplicantAddress) missingFields.push("Applicant Address");
      if (!ApplicantMobileNo) missingFields.push("Applicant Mobile No");
      if (!ApplicantAadharNo) missingFields.push("Applicant Aadhar No");
      if (!ApplicantPanNo) missingFields.push("Applicant Pan No");
      if (!ApplicantEmailId) missingFields.push("Applicant Email Id");
      if (!ApplicantAge) missingFields.push("Applicant Age");
      if (!ApplicationId) missingFields.push("Application id");
  
      if (missingFields.length > 0) {
          sap.m.MessageBox.error("Please fill the required fields:\n" + missingFields.join("\n"));
          return;
      }
  
      // Posting data
      $.ajax({
          url: "/odata/v4/my/applications",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify(NewUser),
          success: (data) => {
              MessageBox.success("You have applied for insurance successfully\nYour insurance id:" + data.Id, {
                  onClose: () => {
                      this.byId("enterApplicantName").setValue("");
                      this.byId("enterApplicantAddress").setValue("");
                      this.byId("enterApplicantMobileNo").setValue("");
                      this.byId("enterEmailId").setValue("");
                      this.byId("enterAadhaarNo").setValue("");
                      this.byId("enterPanNo").setValue("");
                      this.byId("entertheapplicantage").setValue("");
                      this.byId("applicationid").setValue("");
                  }
              });
          },
          error: (error) => {
              MessageToast.show("Error submitting: " + error.responseText);
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
             if(!file){
               sap.m.MessageToast.show("Please choose a file first.");
               return;
             }
             var filename = file.name;
             var filesize = file.size;
                 var extension = filename.substr(filename.lastIndexOf('.')+1).toLowerCase();
             console.log(extension);
 
             if(!["pdf", "jpeg", "png", "jpg"].includes(extension)) {
               sap.m.MessageToast.show("Kindly upload only JPG, JPEG, PDF, and PNG files");
               return;
 
             } else if (filesize > 2000000) {
               sap.m.MessageToast.show("File size should not be more than 2MB.");
               return;
             }
 
             var reader = new FileReader();
             reader.onload = function(e) {
               var fileupArray = new Uint8Array(e.target.result);
                    this.fileData = fileupArray;
 
               //Convert Uint8Array to a string
               var binaryString = Array.from(fileupArray, byte => String.fromCharCode(byte)).join('');
 
               // Convert binary string to Base64
               var base64Stringfile = btoa(binaryString);
               this.filebase64String = base64Stringfile;
               console.log(this.filebase64String);
 
             }.bind(this);
             reader.readAsArrayBuffer(file);
 
 
         },
               
        onClear: function(){
            this.byId("enterApplicantName").setValue("");
            this.byId("enterApplicantAddress").setValue("");
            this.byId("enterApplicantMobileNo").setValue("");
            this.byId("enterEmailId").setValue("");
            this.byId("enterAadharNo").setValue("");
            this.byId("enterPanNo").setValue("");
            this.byId("entertheapplicantage").setValue("");
            this.byId("applicantongoingid").setValue("");
 
 
        },
        nameValidation: function(oEvent) {
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
          numValidation: function(oEvent) {
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
          emailValidation: function(oEvent) {
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
          aadharValidation: function(oEvent) {
            var fieldValue = oEvent.getSource().getValue();
            var fieldName = oEvent.getSource();
            var format = (/^[0-9]{12}$/);
            var blen = fieldValue.length;
         
            if (blen !== 12) {
              fieldName.setValueState(sap.ui.core.ValueState.Error);
              fieldName.setValueStateText("Aadhar number must be 12 digits");
            } else if (!fieldValue.match(format)) {
              fieldName.setValueState(sap.ui.core.ValueState.Error);
              fieldName.setValueStateText("Only Numbers can Accepted");
            } else {
              fieldName.setValueState(sap.ui.core.ValueState.None);
            }
 
          },
          panValidation: function(oEvent) {
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
          ageValidation: function(oEvent) {
            var fieldValue = oEvent.getSource().getValue();
            var fieldName = oEvent.getSource();
            var format = (/^[0-3]{3}$/);
            var blen = fieldValue.length;
         
            if (blen !== 12) {
              fieldName.setValueState(sap.ui.core.ValueState.Error);
              fieldName.setValueStateText("Age number must be 3 digits");
            } else if (!fieldValue.match(format)) {
              fieldName.setValueState(sap.ui.core.ValueState.Error);
              fieldName.setValueStateText("Only Numbers can Accepted");
            } else {
              fieldName.setValueState(sap.ui.core.ValueState.None);
            }
 
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