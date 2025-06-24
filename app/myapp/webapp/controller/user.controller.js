sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/ui/core/Fragment",
  "sap/ui/model/odata/v2/ODataModel",
  "sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, Fragment, ODataModel) {
  "use strict";

  return Controller.extend("myapp.controller.user", {
    onInit: function () {
      const oView = this.getView();

      // Initialize and set OData model
      const oModel = new ODataModel("/odata/v2/my/", true);
      this.oModel = oModel;
      oView.setModel(oModel);

      // Load custom header fragment
      Fragment.load({
        name: "myapp.view.fragments.CustomHeader",
        controller: this
      }).then((oHeader) => {
        oView.byId("navbaruserContainer").addItem(oHeader);
      });

      // Attach route matched handler for authentication check
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.getRoute("user").attachPatternMatched(this._onRouteMatched, this);
    },

    _onRouteMatched: function () {
      const oUserModel = this.getOwnerComponent().getModel("userModel");

      if (!oUserModel || !oUserModel.getProperty("/userId")) {
        sap.m.MessageBox.warning("⚠️ Please login first", {
          title: "Authentication Required",
          actions: [sap.m.MessageBox.Action.OK],
          emphasizedAction: sap.m.MessageBox.Action.OK,
          onClose: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Routelogin");
          }.bind(this)
        });
        return;
      }

      const userId = oUserModel.getProperty("/userId");
      if (userId) {
        this.getUserDetails(userId);
      }
    },

    onNavHome: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("home")
      //this.getOwnerComponent().getRouter().navTo("Home");
  },
  onNavViewPolicy: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("viewPolicy")
      //this.getOwnerComponent().getRouter().navTo("ViewPolicy");

  },
  onNavMyProfile: function () {
      //console.log("button pressed");
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("user");
      //this.getOwnerComponent().getRouter().navTo("MyProfile");
  },
  onNavMyPolicy: function () {

      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      oRouter.navTo("myPolicy");

},
onLogout: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("Routelogin")
        MessageBox.Information("You have been logged out.");
        // Optionally navigate to login or home page
        //this.getOwnerComponent().getRouter().navTo("Login");
    },
getUserDetails: function (userId) {
  const filter = new sap.ui.model.Filter("userId", "EQ", userId);

  this.oModel.read("/users", {
    filters: [filter],
    success: (oData) => {
      if (oData.results.length > 0) {
        const userDetails = oData.results[0];
        const userModel2 = new sap.ui.model.json.JSONModel(userDetails);
        this.getView().setModel(userModel2, "userModel2");
        this.getUserPoliciesByFiltering(userId);
      } else {
        MessageToast.show("User details not found.");
      }
    },
    error: (oError) => {
      MessageToast.show("Error fetching user details.");
      console.error("User fetch error:", oError);
    }
  });
},



getUserPoliciesByFiltering: function (userId) {
  this.oModel.read("/applications", {
    success: (oData) => {
      let hasPolicies = false;
      let userPolicies = [];
      let policyStats = [
        { status: "Approved", count: 0 },
        { status: "Rejected", count: 0 },
        { status: "Pending", count: 0 }
      ];

      if (oData && oData.results.length > 0) {
        userPolicies = oData.results.filter(app => app.user_userId === userId);
        hasPolicies = userPolicies.length > 0;

        const statusCounts = {
          Approved: 0,
          Rejected: 0,
          Pending: 0
        };

        userPolicies.forEach(policy => {
          const status = policy.status;
          if (statusCounts.hasOwnProperty(status)) {
            statusCounts[status]++;
          }
        });

        policyStats = [
          { status: "Approved", count: statusCounts.Approved },
          { status: "Rejected", count: statusCounts.Rejected },
          { status: "Pending", count: statusCounts.Pending }
        ];
      }

      const policyModel = new sap.ui.model.json.JSONModel({
        userPolicies,
        statusData: policyStats,
        hasPolicies
      });

      this.getView().setModel(policyModel, "policyModel");

      const oVizFrame = this.getView().byId("policyChart");
      if (hasPolicies) {
        oVizFrame.setVizProperties({
          title: {
            text: "User Policy Status Overview"
          },
          plotArea: {
            colorPalette: ["#2ecc71", "#e74c3c", "#f39c12"],
            dataLabel: {
              visible: true
            }
          }
        });
      }
    },
    error: (oError) => {
      sap.m.MessageBox.error("Error fetching policies.", {
        title: "Error"
      });
      console.error("Policy fetch error:", oError);
    }
  });
},  
    onChangePassword: function () {
      const oView = this.getView();

      const currentPassword = oView.byId("currentPasswordInput").getValue();
      const newPassword = oView.byId("newPasswordInput").getValue();
      const confirmPassword = oView.byId("confirmPasswordInput").getValue();

      const oUserModel = oView.getModel("userModel2");
      if (!oUserModel) {
        sap.m.MessageBox.error("User details not loaded. Please try again.", {
          title: "Error"
        });
        return;
      }
      const currentPasswordDb = oUserModel.getProperty("/password");

      if (!currentPassword || !newPassword || !confirmPassword) {
        sap.m.MessageBox.warning("Please fill in all fields.", {
          title: "Missing Information"
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        sap.m.MessageBox.warning("New passwords do not match.", {
          title: "Password Mismatch"
        });
        return;
      }

      if (currentPassword !== currentPasswordDb) {
        sap.m.MessageBox.error("Current password is incorrect.", {
          title: "Authentication Failed"
        });
        return;
      }

      // Password strength validation
      const passwordCheck = this._validatePasswordStrength(newPassword);
      if (!passwordCheck.valid) {
        sap.m.MessageBox.warning(passwordCheck.message, {
          title: "Weak Password"
        });
        return;
      }

      // Update password in backend
      const currUser = oView.getModel("userModel").getProperty("/userId");
      this.oModel.update("/users('" + currUser + "')", {
        password: newPassword
      }, {
        success: () => {
          sap.m.MessageBox.success("Password updated successfully.", {
            title: "Success"
          });
          oView.byId("currentPasswordInput").setValue("");
          oView.byId("newPasswordInput").setValue("");
          oView.byId("confirmPasswordInput").setValue("");
        },
        error: (oError) => {
          sap.m.MessageBox.error("Failed to update password.", {
            title: "Update Failed"
          });
          console.error("Password update error:", oError);
        }
      });
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
