sap.ui.define([

    "sap/ui/core/mvc/Controller",

    "sap/m/MessageToast"

], function (Controller, MessageToast) {

    "use strict";

    return Controller.extend("project1.controller.Cart", {

        onInit: function () {

            this._updateCartTotal();

            // Initialize address model if not already available

            var oAddressModel = this.getOwnerComponent().getModel("addresses");

            if (!oAddressModel) {

                oAddressModel = new sap.ui.model.json.JSONModel({

                    addresses: [

                        { id: "addr1", label: "Home - 123 Street, Hyderabad" },

                        { id: "addr2", label: "Office - 456 Tech Park, Hyderabad" }

                    ]

                });

                this.getOwnerComponent().setModel(oAddressModel, "addresses");

            }

        },

        onDeleteItem: function (oEvent) {

            var oCartModel = this.getOwnerComponent().getModel("cart");

            var aItems = oCartModel.getProperty("/items");

            var oDeleted = oEvent.getSource().getBindingContext("cart").getObject();

            // Remove the selected item

            var aFiltered = aItems.filter(item => item.id !== oDeleted.id);

            oCartModel.setProperty("/items", aFiltered);

            this._updateCartTotal();

        },

        _updateCartTotal: function () {

            var oCartModel = this.getOwnerComponent().getModel("cart");

            var aItems = oCartModel.getProperty("/items") || [];

            var total = aItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

            oCartModel.setProperty("/total", total);

        },

        onProceedToCheckout: function () {

            var oRouter = this.getOwnerComponent().getRouter();

            var oCartModel = this.getOwnerComponent().getModel("cart");

            var oSelect = this.byId("addressSelect");

            var sSelectedKey = oSelect ? oSelect.getSelectedKey() : "";

            if (!sSelectedKey) {

                MessageToast.show("Please select a delivery address before checkout.");

                return;

            }

            // Save selected address ID in cart model

            oCartModel.setProperty("/selectedAddressId", sSelectedKey);

            // Navigate to Payment page

            oRouter.navTo("RoutePayment");

        },

        onNavToDashboard: function () {

            this.getOwnerComponent().getRouter().navTo("RouteDashboard");

        },

        onNavToOrders: function () {

            this.getOwnerComponent().getRouter().navTo("RouteOrder");

        }

    });

});
