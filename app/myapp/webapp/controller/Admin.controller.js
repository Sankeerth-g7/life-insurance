sap.ui.define([
  "sap/ui/core/mvc/Controller"
], (BaseController) => {
  "use strict";

  return BaseController.extend("myapp.controller.App", {
    onInit() {
      var oHeader = sap.ui.xmlfragment("myapp.view.fragments.AdminHeader", this);
      this.getView().byId("navbarAdminContainer").addItem(oHeader);
    },
    onAddPolicyPress: function () {
      var oView = this.getView();
      var oRouter = sap.ui.core.UIComponent.getRouterFor(oView);
      oRouter.navTo("AddPolicy");
    },
    onPolicyDetailsPress:function(){
      var oView=this.getView();
      var oRouter=sap.ui.core.UIComponent.getRouterFor(oView);
      oRouter.navTo("PolicyDetails");
    },
    onApplicantDetailsPress:function(){
      var oView=this.getView();
      var oRouter=sap.ui.core.UIComponent.getRouterFor(oView);
      oRouter.navTo("ApplicantDetails");
    }
    
  });
});