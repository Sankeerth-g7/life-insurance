sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/Component"
], function (UIComponent,Component) {
    "use strict";

    return {
        onLinkPress: function (oEvent) {
           const sLinkText = oEvent.getSource().getText();
            const oComponent = Component.getOwnerComponentFor(oEvent.getSource());
            const oRouter = oComponent.getRouter();

            switch (sLinkText) {
               case "About Us":
                    oRouter.navTo("AboutUs");
                    break;
                case "Contact Us":
                    oRouter.navTo("ContactUs");
                    break;
                case "Terms  Conditions":
                    oRouter.navTo("TermsConditions");
                    break;
                case "Privacy Policy":
                    oRouter.navTo("PrivacyPolicy");
                    break;
                case "FAQ":
                    oRouter.navTo("FAQ");
                    break;
                default:
                    sDialogContent = "Information not available.";
            }
           
        }
    };
});

