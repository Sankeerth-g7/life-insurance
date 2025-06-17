sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/ui/core/Fragment",
  "sap/ui/model/odata/v2/ODataModel"
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

      // Get userId from userModel
      const oUserModel = this.getOwnerComponent().getModel("userModel");
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
    getUserDetails: function (userId) {
      const filter = new sap.ui.model.Filter("userId", "EQ", userId);

      this.oModel.read("/users", {
        filters: [filter],
        success: (oData) => {
          if (oData.results.length > 0) {
            const userDetails = oData.results[0];
            console.log (userDetails);
            const userModel2 = new JSONModel({userDetails});
            console.log(userModel2)
            this.getView().setModel(userModel2, "userModel2");
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
    onChangePassword: function () {
      const oView = this.getView();
    
      const currentPassword = oView.byId("currentPasswordInput").getValue();
      const newPassword = oView.byId("newPasswordInput").getValue();
      const confirmPassword = oView.byId("confirmPasswordInput").getValue();
    
      const oUserModel = oView.getModel("userModel2");
      const userDetails = oUserModel.getProperty("/userDetails");
    
      if (!currentPassword || !newPassword || !confirmPassword) {
        MessageToast.show("Please fill in all fields.");
        return;
      }
    
      if (newPassword !== confirmPassword) {
        MessageToast.show("New passwords do not match.");
        return;
      }
    
      if (currentPassword !== userDetails.password) {
        MessageToast.show("Current password is incorrect.");
        return;
      }
    
      // Update password in backend
      this.oModel.update("/users('" + userDetails.userId + "')", {
        password: newPassword
      }, {
        success: () => {
          MessageToast.show("Password updated successfully.");
          oView.byId("currentPasswordInput").setValue("");
          oView.byId("newPasswordInput").setValue("");
          oView.byId("confirmPasswordInput").setValue("");
        },
        error: (oError) => {
          MessageToast.show("Failed to update password.");
          console.error("Password update error:", oError);
        }
      });
    }
    
  });
});
