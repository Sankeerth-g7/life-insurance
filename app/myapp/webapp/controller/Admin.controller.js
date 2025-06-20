sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment",
  "myapp/controller/footer"
], function (BaseController,Fragment,footerFactory) {
  "use strict";

  return BaseController.extend("myapp.controller.App", {
    onInit: function () {
      var oHeader = sap.ui.xmlfragment("myapp.view.fragments.AdminHeader", this);
      this.getView().byId("navbarAdminContainer").addItem(oHeader);

       // Load Footer Fragment
       Fragment.load({
        id: this.createId("CustomFooter"),
        name: "myapp.view.fragments.CustomFooter",
        controller: this
    }).then(function (oFooterContent) {
        this.getView().byId("FooterAdminContainer").addItem(oFooterContent);
    }.bind(this));

    this.footerHandler = footerFactory;
},

     
    // },

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
      oRouter.navTo("Routelogin");
    }
  });
});

