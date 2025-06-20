sap.ui.define([
    "sap/m/Dialog",
    "sap/m/Text",
    "sap/m/Button"
], function (Dialog, Text, Button) {
    "use strict";

    return {
        onLinkPress: function (oEvent) {
            const sLinkText = oEvent.getSource().getText();
            let sDialogContent = "";

            switch (sLinkText) {
                case "About Us":
                    sDialogContent = "We are a leading life insurance company committed to securing your future.";
                    break;
                case "Contact Us":
                    sDialogContent = "You can reach us at support@lti-life.com or call 1800-123-456.";
                    break;
                case "Terms  Conditions":
                    sDialogContent = "Please read our terms and conditions carefully before using our services.";
                    break;
                case "Privacy Policy":
                    sDialogContent = "We value your privacy and ensure your data is protected.";
                    break;
                case "FAQ":
                    sDialogContent = "Find answers to the most frequently asked questions about our services.";
                    break;
                default:
                    sDialogContent = "Information not available.";
            }

            const oDialog = new Dialog({
                title: sLinkText,
                content: new Text({ text: sDialogContent }),
                beginButton: new Button({
                    text: "Close",
                    press: function () {
                        oDialog.close();
                    }
                }),
                afterClose: function () {
                    oDialog.destroy();
                }
            });

            oDialog.open();
        }
    };
});

