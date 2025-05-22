sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller,) {
    "use strict";

    return Controller.extend("myapp.controller.home", {
     onInit: function () {
        var oCarousel = this.byId("imageCarousel");
        var iCurrentPage = 0;
        
  var oHeader = sap.ui.xmlfragment("myapp.view.fragments.CustomHeader", this);
    this.getView().byId("navbarhomeContainer").addItem(oHeader);

            var oFooter = sap.ui.xmlfragment("myapp.view.fragments.CustomFooter", this);
            this.getView().byId("FooterHomeContainer").addItem(oFooter);


            setInterval(function () {
                var aPages = oCarousel.getPages();
                iCurrentPage = (iCurrentPage + 1) % aPages.length;
                oCarousel.setActivePage(aPages[iCurrentPage]);
            }, 3000); // 3000 ms = 3 seconds
        },
        
        
    onNavHome: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(oView);
        oRouter.navTo("home")
        //this.getOwnerComponent().getRouter().navTo("Home");
    },
     onNavViewPolicy: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(oView);
            oRouter.navTo("viewPolicy")
        //this.getOwnerComponent().getRouter().navTo("ViewPolicy");

    },
    onNavMyProfile: function () {
        //console.log("button pressed");
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("myProfile")
        //this.getOwnerComponent().getRouter().navTo("MyProfile");
    },
    onNavMyPolicy: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(oView);
            oRouter.navTo("myPolicy")
        //this.getOwnerComponent().getRouter().navTo("MyPolicy");
    },
    onLogout: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(oView);
        oRouter.navTo("logged out")
        MessageToast.show("You have been logged out.");
        // Optionally navigate to login or home page
        //this.getOwnerComponent().getRouter().navTo("Login");
    }
    });
});


