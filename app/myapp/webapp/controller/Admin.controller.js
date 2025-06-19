sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function (BaseController) {
  "use strict";

  return BaseController.extend("myapp.controller.App", {
    onInit: function () {
      var oHeader = sap.ui.xmlfragment("myapp.view.fragments.AdminHeader", this);
      this.getView().byId("navbarAdminContainer").addItem(oHeader);

     
    },

    onAddPolicyPress: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this.getView());
      oRouter.navTo("AddPolicy");
    },

    onPolicyDetailsPress: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this.getView());
      oRouter.navTo("PolicyDetails");
    },

    onApplicantDetailsPress: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this.getView());
      oRouter.navTo("ApplicantDetails");
    },

    onLogout: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this.getView());
      oRouter.navTo("Admin"); // Navigate to Admin Home page
    }
  });
});

