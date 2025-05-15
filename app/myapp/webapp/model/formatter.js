sap.ui.define([], function () {
    "use strict";
    return {
        getPolicyIcon: function (sType) {
            switch (sType) {
                case "Whole Life":
                    return "images/life-icon.png";
                case "Whole Life Insurance":
                    return "images/wholelife-icon.png";
                case "Endowment Plan":
                    return "images/Endowment-icon.png";
                case "Health Insurance":
                    return "images/Health-icon.png";
                case "Pension Plan":
                    return "images/Retire-icon.png";
                case "Group Insurance":
                    return "images/Group-icon.png";
                case "Child Plan":
                    return "images/Child-icon.png";
                case "Accident Cover":
                    return "images/Accident-icon.png";
                case "Travel Insurance":
                    return "images/travel-icon.png";
                default:
                    return "images/default-icon.png";
            }
        },
       
    };
});
