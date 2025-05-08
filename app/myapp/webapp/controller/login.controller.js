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
        var fullName = this.byId("fullName").getValue();
        var email = this.byId("registerEmail").getValue();
        var mobile = this.byId("mobileNumber").getValue();
        var username = this.byId("username").getValue();
        var password = this.byId("registerPassword").getValue();
        var confirmPassword = this.byId("confirmPassword").getValue();
        var termsAccepted = this.byId("terms").getSelected();
        if (!fullName || !email || !mobile || !username || !password || !confirmPassword) {
            MessageToast.show("Please fill in all fields.");
            return;
        }
        
        if (password !== confirmPassword) {
            MessageToast.show("Passwords do not match.");
            return;
        }
        if (!termsAccepted) {
            MessageToast.show("You must agree to the Terms & Conditions.");
            return;
        }
        MessageToast.show("Registration successful!");
    },
    
    onForgotPasswordPress: function () {
        MessageToast.show("Forgot Password clicked.");
    },
    onToggleForm: function () {
        var isLoginVisible = this._loginForm.getVisible();
        this._loginForm.setVisible(!isLoginVisible);
        this._registerForm.setVisible(isLoginVisible);
    }

    });
});


