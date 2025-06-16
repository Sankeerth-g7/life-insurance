sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/odata/v2/ODataModel"
], function (Controller, MessageToast, ODataModel) {
    "use strict";
 
    return Controller.extend("myapp.controller.login", {
     onInit: function () {
        this._loginForm = this.byId("loginForm");
        this._registerForm = this.byId("registerForm");
        
       var url = "/odata/v2/my/";
        this.oModel = new ODataModel(url, true);
        this.getView().setModel(this.oModel);
        
        
 //var oHeader = sap.ui.xmlfragment("myapp.view.fragments.CustomHeader", this);
 //this.getView().byId("navbarLoginContainer").addItem(oHeader);

    // var oFooter = sap.ui.xmlfragment("myapp.view.fragments.CustomFooter", this);
    // this.getView().byId("FooterLoginContainer").addItem(oFooter);

    },
   
    onLoginPress: function () {
        var oView = this.getView();
        var input = oView.byId("emailInput").getValue(); // Can be email or username
        var password = oView.byId("passwordInput").getValue();
   
        if (!input) {
            sap.m.MessageBox.information("Please enter your email or username.");
            oView.byId("emailInput").setValueState("Error");
            return;
        } else {
            oView.byId("emailInput").setValueState("None");
        }
   
        if (!password) {
            sap.m.MessageBox.error("Please enter your password.");
            oView.byId("passwordInput").setValueState("Error");
            return;
        } else {
            oView.byId("passwordInput").setValueState("None");
        }
   
        var oFilterEmail = new sap.ui.model.Filter("email", sap.ui.model.FilterOperator.EQ, input);
        var oFilterUsername = new sap.ui.model.Filter("username", sap.ui.model.FilterOperator.EQ, input);
        var oCombinedFilter = new sap.ui.model.Filter({
            filters: [oFilterEmail, oFilterUsername],
            and: false
        });
   
        var that = this;
   
        this.oModel.read("/users", {
            filters: [oCombinedFilter],
            success: function (oData) {
                if (oData.results.length === 0) {
                    sap.m.MessageBox.information("User not found.");
                    return;
                }
   
                var user = oData.results[0];
                var now = new Date();
 
                var lockUntilDate = null;
 
                if (user.lockUntil) {
                    var lockUntilTimestamp = parseInt(user.lockUntil.match(/\d+/)[0], 10);
                    lockUntilDate = new Date(lockUntilTimestamp);
                }
 
                // console.log(user.isLocked, lockUntilDate, now, lockUntilDate && lockUntilDate > now);
 
                if (user.isLocked === "true" && lockUntilDate && lockUntilDate > now) {
                    sap.m.MessageBox.warning("Account is locked. Try again later.");
                    return;
                }
 
   
                if (user.password === password) {
                    user.failedAttempts = 0;
                    user.isLocked = "false";
                    user.lockUntil = null;
                    user.lastFailedAttempt = null;
   
                    that.oModel.update("/users(" + user.userId + ")", user, {
                        success: function () {
                            sap.m.MessageBox.success("Login successful!");
                            var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                            oRouter.navTo("home");
                            var oUserModel = new sap.ui.model.json.JSONModel({ userId: user.userId });
                            that.getOwnerComponent().setModel(oUserModel, "userModel");
                        },
                        error: function (oError) {
                            console.log(oError)
                            // var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                            // oRouter.navTo("home")
                            sap.m.MessageBox.error("Some Error occured please try later");
                        }
                    });
                } else {
                    user.failedAttempts = (user.failedAttempts || 0) + 1;
                    user.lastFailedAttempt = now.toISOString();
   
                    if (user.failedAttempts >= 3) {
                        user.isLocked = "true";
                        var lockUntil = new Date();
                        lockUntil.setHours(lockUntil.getHours() + 1);
                        // console.log(lockUntil)
                        user.lockUntil = lockUntil
                        // console.log(user.lockUntil,"qwertyuiuygtf")
                        sap.m.MessageBox.warning("Account locked due to multiple failed attempts. Try again in 1 hour.");
                    } else {
                        sap.m.MessageBox.error("Incorrect password.");
                    }
 
                    // console.log(user.lockUntil)
                    // console.log(user,"hereeee is userrrrr")
   
                    that.oModel.update("/users(" + user.userId + ")", user, {
                        error: function () {
                            sap.m.MessageBox.error("Failed to update login attempt.");
                        }
                    });
                }
            },
            error: function () {
                sap.m.MessageBox.error("Error while logging in. Please try again.");
            }
        });
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
            sap.m.MessageBox.warning("Please fill in all mandatory fields.");
            return;
        }
        if (!emailPattern.test(email)) {
            sap.m.MessageBox.warning("Please enter a valid email address.");
            return;
        }
        if (!phonePattern.test(phone)) {
            sap.m.MessageBox.warning("Please enter a valid 10-digit mobile number.");
            return;
        }
        if (password !== confirmPassword) {
            sap.m.MessageBox.warning("Passwords do not match.");
            return;
        }
        if (!termsAccepted) {
            sap.m.MessageBox.warning("Please accept the Terms & Conditions.");
            return;
        }
        var oData = {
            userId: new Date().getTime().toString(),
            email: email,
            phone: phone,
            username: username,
            password: password,
            role: "User",
            failedAttempts: 0,
            lastFailedAttempt: null,
            isLocked: "false",
            lockUntil: null
        };
        this.oModel.create("/users", oData, {
            success: function () {
                sap.m.MessageBox.success("Registration successful!");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(oView);
                oRouter.navTo("home");
                var oUserModel = new sap.ui.model.json.JSONModel({ userId: oData.userId });
                oView.getController().getOwnerComponent().setModel(oUserModel, "userModel");
            },
            error: function (oError) {
                var errorMessage = oError.responseText ? JSON.parse(oError.responseText).error.message : "Unexpected error occurred.";
                sap.m.MessageBox.error(errorMessage);
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

// password visibility
 
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


