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
                    sDialogContent = 
                    "SBI Life Insurance, incorporated in October 2000, is one of India's most trusted life insurance companies. " + 
                            "It serves millions of families across India with a wide range of products including Protection, Pension, Savings, and Health solutions. " +
                            "With over 1,110 offices and 240,000+ agents, SBI Life is committed to making insurance accessible to all and enhancing digital experiences for customers and employees alike." 


                    ;
                    break;
                case "Contact Us":
                    sDialogContent = " Customer Support: 1800 267 9090 \n  Email: info@ltilifeinsurance.co.in \n You can reach us at support@lti-life.com or call 1800-123-456.";
                    break;
                case "Terms  Conditions":
                    sDialogContent = 
                    "By using LTI Life Insurance services, you agree to the terms outlined in your policy documents. " +
                    "These include conditions related to premium payments, claim procedures, exclusions, and benefits. " +
                    "Please refer to your specific policy for detailed terms or visit www.sbilife.co.in for more information."
                    ;
                    break;
                case "Privacy Policy":
                    sDialogContent = 
                    "LTI Life Insurance is committed to protecting your personal data. We collect and use your information only for policy servicing, claims, and regulatory compliance. " +
                    "Your data is stored securely and shared only with authorized entities. For full details, visit our Privacy Policy page on www.sbilife.co.in."
                    ;
                    break;
                case "FAQ":
                    sDialogContent = 

                     "Q: How do I file a claim?\n" +
                    "A: You can file a claim online at www.sbilife.co.in or visit your nearest LTI Life branch.\n\n" +
                    "Q: What is the claim settlement ratio?\n" +
                    "A: LTILife has a claim settlement ratio of 94.52%.\n\n" +
                    "Q: What types of plans are available?\n" +
                    "A: LTI Life offers savings, protection, retirement, child, and unit-linked plans."
                    ;
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

