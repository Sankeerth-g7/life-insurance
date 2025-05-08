sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("myapp.controller.login", {
        onLoginPress: function () {
            var emailInput = this.byId("emailInput");
            var passwordInput = this.byId("passwordInput");
            var email = emailInput.getValue();
            var password = passwordInput.getValue();
            
            // Email validation regex
            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!email) {
                MessageToast.show("Please enter your email.");
                emailInput.setValueState("Error");
                return;
            } else if (!emailPattern.test(email)) {
                MessageToast.show("Please enter a valid email.");
                emailInput.setValueState("Error");
                return;
            } else {
                emailInput.setValueState("None");
            }

            if (!password) {
                MessageToast.show("Please enter your password.");
                passwordInput.setValueState("Error");
                return;
            } else {
                passwordInput.setValueState("None");
            }

            // Proceed with login logic
            MessageToast.show("Login successful!");
        },
        
        onForgotPasswordPress: function () {
            // Handle forgot password logic
            MessageToast.show("Forgot Password clicked.");
        },
        
        onRegisterPress: function () {
            // Handle registration logic
            MessageToast.show("Register clicked.");
        }
    });
});
