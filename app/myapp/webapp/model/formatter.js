sap.ui.define([], function () {
    "use strict";
    return {
        getPolicyIcon: function (sType) {
            switch (sType) {
                case "Whole Life":
                    return "images/life-icon.png";
                case "Term":
                    return "images/term-icon.png";
                case "Endowment":
                    return "images/endowment-icon.png";
                default:
                    return "images/default-icon.png";
            }
        },

        getCardBackgroundClass: function (sType) {
            switch (sType) {
                case "Whole Life":
                    return "bgWholeLife";
                case "Term":
                    return "bgTerm";
                case "Endowment":
                    return "bgEndowment";
                default:
                    return "bgDefault";
            }
        }
    };
});
