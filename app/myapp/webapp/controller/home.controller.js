sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, ) {
    "use strict";

    return Controller.extend("myapp.controller.home", {
     onInit: function () {
        var oCarousel = this.byId("imageCarousel");
        var iCurrentPage = 0;
        
        setInterval(function () {
            var aPages = oCarousel.getPages();
            iCurrentPage = (iCurrentPage + 1) % aPages.length;
            oCarousel.setActivePage(aPages[iCurrentPage]);
            }, 3000); // 3000 ms = 3 seconds
        },
        
        
    onNavHome: function () {
        this.getOwnerComponent().getRouter().navTo("Home");
    },
     onNavViewPolicy: function () {
        this.getOwnerComponent().getRouter().navTo("ViewPolicy");
    },
    onNavMyProfile: function () {
        this.getOwnerComponent().getRouter().navTo("MyProfile");
    },
    onNavMyPolicy: function () {
        this.getOwnerComponent().getRouter().navTo("MyPolicy");
    },
    onLogout: function () {
        MessageToast.show("You have been logged out.");
        // Optionally navigate to login or home page
        this.getOwnerComponent().getRouter().navTo("Login");
    }
    });
});


