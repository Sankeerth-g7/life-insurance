sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("myapp.controller.login", {
     onInit: function () {
        this._loginForm = this.byId("loginForm");
        this._registerForm = this.byId("registerForm");
    },
    
    onLoginPress: function () {
        var email = this.byId("emailInput").getValue();
        var password = this.byId("passwordInput").getValue();
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         if (!email) {
            MessageToast.show("Please enter your email.");
            this.byId("emailInput").setValueState("Error");
            return;
         } else if (!emailPattern.test(email)) {
            MessageToast.show("Please enter a valid email.");
            this.byId("emailInput").setValueState("Error");
            return;
        } else {
            this.byId("emailInput").setValueState("None");
         }
         if (!password) {
            MessageToast.show("Please enter your password.");
            this.byId("passwordInput").setValueState("Error");
            return;
        } else {
            this.byId("passwordInput").setValueState("None");
        }
        MessageToast.show("Login successful!");
    },
    onRegister: function () {
        var oView = this.getView();

        var oData = {
            userId: new Date().getTime().toString(), //should be change or try to send it blank
            email: oView.byId("registerEmail").getValue(),
            phone: oView.byId("mobileNumber").getValue(),
            username: oView.byId("username").getValue(),
            password: oView.byId("registerPassword").getValue(),
            role: "User"
        };
        MessageToast.show(oData.email);
    

        if (!oData.email || !oData.phone || !oData.username || !oData.password) {
            MessageToast.show("Please fill in all mandatory fields.");
            return;
        }
    
        // Send data to backend
        var that = this;

        $.ajax({
            url: "/odata/v4/my/InsertUserDetails",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(oData),
            success: function () {
                MessageToast.show("Registration successfuuuuuuuuuuuuul!");
                
                var oRouter = sap.ui.core.UIComponent.getRouterFor(oView);
                oRouter.navTo("home");

            },
            error: function (xhr, status, error) {
                var errorMessage = xhr.responseText ? JSON.parse(xhr.responseText).error.message : "Unexpected error occurred."; //need to be removed afterwards
                MessageToast.show(errorMessage);
            }
        });
    },
    
    
    onForgotPasswordPress: function () {
        MessageToast.show("Forgot Password clicked.");
    },

    onToggleForm: function () {
        var isLoginVisible = this._loginForm.getVisible();
        this._loginForm.setVisible(!isLoginVisible);
        this._registerForm.setVisible(isLoginVisible);
    },
    onToggleLoginPasswordVisibility: function (oEvent) {
    this._togglePasswordVisibility("passwordInput", oEvent);
},

onToggleRegisterPasswordVisibility: function (oEvent) {
    this._togglePasswordVisibility("registerPassword", oEvent);
},

onToggleConfirmPasswordVisibility: function (oEvent) {
    this._togglePasswordVisibility("confirmPassword", oEvent);
},

_togglePasswordVisibility: function (sInputId, oEvent) {
    var oInput = this.byId(sInputId);
    var oButton = oEvent.getSource();
    var bIsPassword = oInput.getType() === "Password";

    oInput.setType(bIsPassword ? "Text" : "Password");
    oButton.setIcon(bIsPassword ? "sap-icon://hide" : "sap-icon://show");
},
onToggleLoginPasswordVisibility: function () {
    this._togglePasswordVisibility("passwordInput");
},

onToggleRegisterPasswordVisibility: function () {
    this._togglePasswordVisibility("registerPassword");
},

onToggleConfirmPasswordVisibility: function () {
    this._togglePasswordVisibility("confirmPassword");
},

_togglePasswordVisibility: function (sInputId) {
    var oInput = this.byId(sInputId);
    var bIsPassword = oInput.getType() === "Password";
    oInput.setType(bIsPassword ? "Text" : "Password");
    oInput.setValueHelpIconSrc(bIsPassword ? "sap-icon://hide" : "sap-icon://show");
}


    });
});


