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
    
        var fullName = oView.byId("fullName").getValue();
        var email = oView.byId("registerEmail").getValue();
        var phone = oView.byId("mobileNumber").getValue();
        var username = oView.byId("username").getValue();
        var password = oView.byId("registerPassword").getValue();
        var confirmPassword = oView.byId("confirmPassword").getValue();
        var termsAccepted = oView.byId("terms").getSelected();
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var phonePattern = /^[0-9]{10}$/;
        if (!fullName || !email || !phone || !username || !password || !confirmPassword) {
            MessageToast.show("Please fill in all mandatory fields.");
            return;
        }
        if (!emailPattern.test(email)) {
            MessageToast.show("Please enter a valid email address.");
            return;
        }
        if (!phonePattern.test(phone)) {
            MessageToast.show("Please enter a valid 10-digit mobile number.");
            return;
        }
        if (password !== confirmPassword) {
            MessageToast.show("Passwords do not match.");
            return;
        }
        if (!termsAccepted) {
            MessageToast.show("Please accept the Terms & Conditions.");
            return;
        }
        var oData = {
            userId: new Date().getTime().toString(),
            email: email,
            phone: phone,
            username: username,
            password: password,
            role: "User"
        };
        $.ajax({
            url: "/odata/v4/my/InsertUserDetails",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(oData),
            success: function () {
                MessageToast.show("Registration successful!");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(oView);
                oRouter.navTo("home");
            },
            error: function (xhr) {
                var errorMessage = xhr.responseText ? JSON.parse(xhr.responseText).error.message : "Unexpected error occurred.";
                MessageToast.show(errorMessage);
            }
        });
    },
     
    onForgotPasswordPress: function () {
        var oDialog = new sap.m.Dialog({
            title: "Reset Password",
            content: [
                new sap.m.Label({ text: "Enter your registered email:", labelFor: "emailInput" }),
                new sap.m.Input("forgotEmailInput", {
                    type: sap.m.InputType.Email,
                    placeholder: "Enter your email",
                    liveChange: function (oEvent) {
                        var sValue = oEvent.getParameter("value");
                        oDialog.getBeginButton().setEnabled(sValue.includes("@"));
                    }
                })
            ],
            beginButton: new sap.m.Button({
                text: "Send Reset Link",
                enabled: false,
                press: function () {
                    var sEmail = sap.ui.getCore().byId("forgotEmailInput").getValue();
                    
                    if (!sEmail) {
                        sap.m.MessageToast.show("Please enter a valid email.");
                        return;
                    }
    
                    // Simulate backend call
                    $.ajax({
                        url: "/api/reset-password",
                        type: "POST",
                        data: JSON.stringify({ email: sEmail }),
                        contentType: "application/json",
                        success: function () {
                            sap.m.MessageToast.show("Reset link sent to " + sEmail);
                        },
                        error: function () {
                            sap.m.MessageToast.show("Error sending reset link.");
                        }
                    });
    
                    oDialog.close();
                }
            }),
            endButton: new sap.m.Button({
                text: "Cancel",
                press: function () {
                    oDialog.close();
                }
            })
        });
    
        oDialog.open();
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


