sap.ui.define([

    "sap/ui/core/mvc/Controller",

    "sap/ui/model/json/JSONModel",

    "sap/m/MessageToast"

], function (Controller, JSONModel, MessageToast) {

    "use strict";

    return Controller.extend("project1.controller.Dashboard", {

        onInit: function () {

            // Load product data

            var oProductsModel = new JSONModel();

            oProductsModel.loadData("model/products.json");

            // Attach once loaded

            oProductsModel.attachRequestCompleted(() => {

                const aProducts = oProductsModel.getData().filteredProducts;

                oProductsModel.setProperty("/filteredProducts", aProducts);

                oProductsModel.setProperty("/originalProducts", JSON.parse(JSON.stringify(aProducts)));

            });

            this.getView().setModel(oProductsModel, "products");

            // Initialize cart model if not already set

            if (!this.getOwnerComponent().getModel("cart")) {

                var oCartModel = new JSONModel({ items: [], total: 0 });

                this.getOwnerComponent().setModel(oCartModel, "cart");

            }

            // Initialize orders model

            if (!this.getOwnerComponent().getModel("orders")) {

                var oOrdersModel = new JSONModel({ orders: [] });

                this.getOwnerComponent().setModel(oOrdersModel, "orders");

            }

        },

        onAddToCart: function (oEvent) {

            var oProduct = oEvent.getSource().getBindingContext("products").getObject();

            var oCartModel = this.getOwnerComponent().getModel("cart");

            var aItems = oCartModel.getProperty("/items") || [];

            var oExisting = aItems.find(item => item.id === oProduct.id);

            if (oExisting) {

                oExisting.quantity += 1;

            } else {

                aItems.push({

                    id: oProduct.id,

                    name: oProduct.name,

                    image: oProduct.image,

                    price: oProduct.price,

                    quantity: 1

                });

            }

            oCartModel.setProperty("/items", aItems);

            this._updateCartTotal();

            MessageToast.show("Added to cart");

        },

        _updateCartTotal: function () {

            var oCartModel = this.getOwnerComponent().getModel("cart");

            var aItems = oCartModel.getProperty("/items") || [];

            var total = aItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            oCartModel.setProperty("/total", total);

        },

        onSearch: function (oEvent) {

            var sQuery = oEvent.getParameter("newValue") || oEvent.getParameter("value");

            var oModel = this.getView().getModel("products");

            var aOriginal = oModel.getProperty("/originalProducts");

            var aFiltered = sQuery

                ? aOriginal.filter(item => item.name.toLowerCase().includes(sQuery.toLowerCase()))

                : aOriginal;

            oModel.setProperty("/filteredProducts", aFiltered);

        },

        onSort: function (oEvent) {

            var sKey = oEvent.getParameter("selectedItem").getKey();

            var oModel = this.getView().getModel("products");

            var aProducts = oModel.getProperty("/filteredProducts") || [];

            if (sKey === "asc") {

                aProducts.sort((a, b) => a.price - b.price);

            } else if (sKey === "desc") {

                aProducts.sort((a, b) => b.price - a.price);

            }

            oModel.setProperty("/filteredProducts", aProducts);

        },

        // Navigation functions for header bar

        onNavToDashboard: function () {

            this.getOwnerComponent().getRouter().navTo("RouteDashboard");

        },

        onNavToCart: function () {

            this.getOwnerComponent().getRouter().navTo("RouteCart");

        },

        onNavToOrders: function () {

            this.getOwnerComponent().getRouter().navTo("RouteOrders");

        }

    });

});
