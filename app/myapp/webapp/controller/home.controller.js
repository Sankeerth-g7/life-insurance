sap.ui.define([
    "sap/ui/core/mvc/Controller",
   // "sap/m/MessageToast",
    "myapp/controller/footer",
    "sap/m/MessageBox"
], function (Controller, footerFactory, MessageBox ) {
    "use strict";

    return Controller.extend("myapp.controller.home", {
        onInit: function () {
            var oCarousel = this.byId("imageCarousel");
            var iCurrentPage = 0;
            this.footerHandler = footerFactory
            var oHeader = sap.ui.xmlfragment("myapp.view.fragments.CustomHeader", this);
            this.getView().byId("navbarhomeContainer").addItem(oHeader);

        var oFooter = sap.ui.xmlfragment("myapp.view.fragments.CustomFooter", this);
        this.getView().byId("FooterhomeContainer").addItem(oFooter);

            setInterval(function () {
                var aPages = oCarousel.getPages();
                iCurrentPage = (iCurrentPage + 1) % aPages.length;
                oCarousel.setActivePage(aPages[iCurrentPage]);
            }, 3000); // 3000 ms = 3 seconds
        },


        onLinkPress: function (oEvent) {
            this.footerHandler.onLinkPress(oEvent); // delegate to shared logic
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
            oRouter.navTo("myProfile");
            //this.getOwnerComponent().getRouter().navTo("MyProfile");
        },
        onNavMyPolicy: function () {

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("myPolicy");

    },
    onLogout: function () {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("login")
        MessageBox.Information("You have been logged out.");
        // Optionally navigate to login or home page
        //this.getOwnerComponent().getRouter().navTo("Login");
    }
    });
});




