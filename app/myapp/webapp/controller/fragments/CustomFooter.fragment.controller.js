sap.ui.define([
    "sap/ui/base/Object",
    "sap/ui/core/Fragment",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Text"
], function (BaseObject, Fragment, Dialog, Button, Text) {
    "use strict";

    return BaseObject.extend("myapp.controller.CustomFooter.fragment", {
        constructor: function (oView) {
            this._oView = oView;
        },

        loadFooter: function () {
            var currentYear = new Date().getFullYear();

            return Fragment.load({
                name: "myapp.view.fragments.CustomFooter",
                controller: this
            }).then(function (oFragment) {
                this._oView.byId("footerContainer").addItem(oFragment);
                this._oView.byId("footerText").setText("© " + currentYear + " LTI Life Insurance. All rights reserved.");
            }.bind(this));
        },

        _createDialog: function (title, content) {
            return new Dialog({
                title: title,
                content: new Text({ text: content }),
                beginButton: new Button({
                    text: "Close",
                    press: function () {
                        this.getParent().close();
                    }
                }),
                afterClose: function () {
                    this.destroy();
                }
            });
        },

        onAboutUsPress: function () {
            this._createDialog("About Us", "LTI Life Insurance is committed to securing your future...").open();
        },

        onContactUsPress: function () {
            this._createDialog("Contact Us", "Customer Support: 1800-123-4567...").open();
        },

        onTermsPress: function () {
            this._createDialog("Terms & Conditions", "By using our services, you agree to our terms...").open();
        },

        onPrivacyPress: function () {
            this._createDialog("Privacy Policy", "We value your privacy...").open();
        },

        onFaqPress: function () {
            this._createDialog("FAQ", "Q: How do I file a claim?\nA: You can file a claim...").open();
        }
    });
});
