sap.ui.define([
    "sap/ui/core/mvc/Controller",
    //"sap/m/MessageToast",
    "sap/m/MessageBox", 
    "sap/ui/model/odata/v2/ODataModel"
], function (Controller, MessageBox, ODataModel) {
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
            MessageBox.information("Please enter your email or username.");
            oView.byId("emailInput").setValueState("Error");
            return;
        } else {
            oView.byId("emailInput").setValueState("None");
        }

        if (!password) {
            MessageBox.error("Please enter your password.");
            oView.byId("passwordInput").setValueState("Error");
            return;
        } else {
            oView.byId("passwordInput").setValueState("None");
        }

        // Password strength validation before proceeding
        var passwordCheck = this._validatePasswordStrength(password);
        if (!passwordCheck.valid) {
            MessageBox.warning(passwordCheck.message);
            return;
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
                    MessageBox.information("User not found.");
                    return;
                }
   
                var user = oData.results[0];
                var now = new Date();
 
                var lockUntilDate = null;
 
                if (user.lockUntil) {
                    var lockUntilTimestamp;
                    if (typeof user.lockUntil === "number") {
                        lockUntilTimestamp = user.lockUntil;
                    } else if (typeof user.lockUntil === "string") {
                        lockUntilTimestamp = parseInt(user.lockUntil, 10);
                    } else if (user.lockUntil instanceof Date) {
                        lockUntilTimestamp = user.lockUntil.getTime();
                    }
                    lockUntilDate = new Date(lockUntilTimestamp);
                }
 
                // console.log(user.isLocked, lockUntilDate, now, lockUntilDate && lockUntilDate > now);
 
                if (user.isLocked === "true" && lockUntilDate && lockUntilDate > now) {
                    var unlockTime = lockUntilDate.toLocaleString(); // Formats date & time for user
                    MessageBox.warning("Account is locked. Try again after: " + unlockTime);
                    return;
                }
 
   
                if (user.password === password) {
                    user.failedAttempts = 0;
                    user.isLocked = "false";
                    user.lockUntil = null;
                    user.lastFailedAttempt = null;
   
                    that.oModel.update("/users(" + user.userId + ")", user, {
                        success: function () {
                            MessageBox.success("Login successful!");
                            // Clear input fields
                            oView.byId("emailInput").setValue("");
                            oView.byId("passwordInput").setValue("");

                            if (user.role === "Admin") {
                                var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                                oRouter.navTo("Admin");
                            } else {
                                var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                                oRouter.navTo("home");
                            }
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
                        MessageBox.warning("Account locked due to multiple failed attempts. Try again in 1 hour.");
                    } else {
                        MessageBox.error("Incorrect password.");
                    }
 
                    // console.log(user.lockUntil)
                    // console.log(user,"hereeee is userrrrr")
   
                    that.oModel.update("/users(" + user.userId + ")", user, {
                        error: function () {
                            MessageBox.error("Failed to update login attempt.");
                        }
                    });
                }
            },
            error: function () {
                MessageBox.error("Error while logging in. Please try again.");
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
            MessageBox.warning("Please fill in all mandatory fields.");
            return;
        }
        if (!emailPattern.test(email)) {
            MessageBox.warning("Please enter a valid email address.");
            return;
        }
        if (!phonePattern.test(phone)) {
            MessageBox.warning("Please enter a valid 10-digit mobile number.");
            return;
        }
        if (password !== confirmPassword) {
            MessageBox.warning("Passwords do not match.");
            return;
        }
        if (!termsAccepted) {
            MessageBox.warning("Please accept the Terms & Conditions.");
            return;
        }
        var passwordCheck = this._validatePasswordStrength(password);
if (!passwordCheck.valid) {
    MessageBox.warning(passwordCheck.message);
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
                MessageBox.success("Registration successful!");

                // Clear all input fields
                    oView.byId("fullName").setValue("");
                    oView.byId("registerEmail").setValue("");
                     oView.byId("mobileNumber").setValue("");
                     oView.byId("username").setValue("");
                     oView.byId("registerPassword").setValue("");
                     oView.byId("confirmPassword").setValue("");
                     oView.byId("terms").setSelected(false);

                var oRouter = sap.ui.core.UIComponent.getRouterFor(oView);
                oRouter.navTo("home");
                var oUserModel = new sap.ui.model.json.JSONModel({ userId: oData.userId });
                oView.getController().getOwnerComponent().setModel(oUserModel, "userModel");
            },
            error: function (oError) {
                var errorMessage = oError.responseText ? JSON.parse(oError.responseText).error.message : "Unexpected error occurred.";
                MessageBox.error(errorMessage);
            }
        });
    },

    onForgotPasswordPress: function () {
        var that = this;
        var oDialog = new sap.m.Dialog({
            title: "Reset Password",
            content: [
                new sap.m.Label({ text: "Enter your registered email:", labelFor: "forgotEmailInput" }),
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
                text: "Send OTP",
                enabled: false,
                press: function () {
                    var sEmail = sap.ui.getCore().byId("forgotEmailInput").getValue();
                    that._sendOtpToUser(sEmail); //triggers the cap action
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

    // 
    _sendOtpToUser: function (sEmail) {
    var that = this;
    this.oModel.callFunction("/sendOtp", {
        method: "POST",
        urlParameters: {
            email: sEmail
        },
        success: function (oData) {
            sap.m.MessageToast.show("OTP sent to your email.");
            that._fetchUserByEmail(sEmail);
        },
        error: function (oError) {
            sap.m.MessageBox.error("Failed to send OTP.");
        }
    });
},

    //
    _fetchUserByEmail: function (sEmail) {
        var that = this;
    
        this.oModel.read("/users", {
            filters: [new sap.ui.model.Filter("email", sap.ui.model.FilterOperator.EQ, sEmail)],
            success: function (oData) {
                if (oData.results.length === 0) {
                    sap.m.MessageBox.information("User not found.");
                    return;
                }
    
                var user = oData.results[0];
                that._openOtpVerificationDialog(user);
            },
            error: function () {
                sap.m.MessageBox.error("Error while fetching user.");
            }
        });
    },
    

    //
    _openOtpVerificationDialog: function (user) {
        var that = this;
        var oDialog = new sap.m.Dialog({
            title: "Verify OTP",
            content: [
                new sap.m.Label({ text: "Enter the OTP sent to your email:" }),
                new sap.m.Input("otpInput", {
                    type: sap.m.InputType.Number,
                    placeholder: "Enter OTP"
                })
            ],
            beginButton: new sap.m.Button({
                text: "Verify",
                press: function () {
                    var sEnteredOtp = sap.ui.getCore().byId("otpInput").getValue();
                    if (sEnteredOtp === user.otp) {
                        sap.m.MessageToast.show("OTP verified.");
                        oDialog.close();
                        that._openNewPasswordDialog(user);
                    } else {
                        sap.m.MessageBox.error("Invalid OTP.");
                    }
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

    //

    _openNewPasswordDialog: function (user) {
        var that = this;
        var oDialog = new sap.m.Dialog({
            title: "Reset Password",
            content: [
                new sap.m.Label({ text: "New Password:" }),
                new sap.m.Input("newPasswordInput", {
                    type: "Password",
                    placeholder: "Enter new password"
                }),
                new sap.m.Label({ text: "Confirm Password:" }),
                new sap.m.Input("confirmPasswordInput", {
                    type: "Password",
                    placeholder: "Confirm new password"
                })
            ],
            beginButton: new sap.m.Button({
                text: "Reset",
                press: function () {
                    var sNewPassword = sap.ui.getCore().byId("newPasswordInput").getValue();
                    var sConfirmPassword = sap.ui.getCore().byId("confirmPasswordInput").getValue();
    
                    if (sNewPassword !== sConfirmPassword) {
                        sap.m.MessageBox.warning("Passwords do not match.");
                        return;
                    }
    
                    user.password = sNewPassword;
                    user.otp = null;
    
                    var passwordCheck = that._validatePasswordStrength(sNewPassword);
if (!passwordCheck.valid) {
    sap.m.MessageBox.warning(passwordCheck.message);
    return;
}
    
                    that.oModel.update("/users(" + user.userId + ")", user, {
                        success: function () {
                            sap.m.MessageToast.show("Password reset successfully.");
                            oDialog.close();
                        },
                        error: function () {
                            sap.m.MessageBox.error("Failed to reset password.");
                        }
                    });
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
},
_validatePasswordStrength: function(password) {
    if (password.length < 8) {
        return { valid: false, message: "Password must be at least 8 characters long." };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: "Password must contain at least one uppercase letter." };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: "Password must contain at least one lowercase letter." };
    }
    if (!/\d/.test(password)) {
        return { valid: false, message: "Password must contain at least one digit." };
    }
    if (!/[\W_]/.test(password)) {
        return { valid: false, message: "Password must contain at least one special character." };
    }
    return { valid: true };
}
    });
});


