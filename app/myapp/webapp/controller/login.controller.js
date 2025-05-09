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
        var that = this;
    
        var oData = {
            userId: new Date().getTime().toString(),
            email: this.byId("registerEmail").getValue(),
            phone: this.byId("mobileNumber").getValue(),
            username: this.byId("username").getValue(),
            password: this.byId("registerPassword").getValue(),
            role: "User"
        };
    
        if (!oData.email || !oData.phone || !oData.username || !oData.password) {
            MessageToast.show("Please fill in all mandatory fields.");
            return;
        }
    
        $.ajax({
            url: "/odata/v4/my/InsertUserDetails",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(oData),
            success: function () {
                MessageToast.show("Registration successful!");
    
                // Debug navigation
                var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                console.log("Router instance:", oRouter);
                oRouter.navTo("home")
                
                if (!oRouter) {
                    MessageToast.show("Router is undefined. Navigation failed.");
                    return;
                }
    
                console.log("Navigating to home...");
                oRouter.navTo("home", {}, true);
            },
            error: function (xhr) {
                var errorMessage = xhr.responseText ? JSON.parse(xhr.responseText).error.message : "Unexpected error occurred.";
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
    }

    });
});


