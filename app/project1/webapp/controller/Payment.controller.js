sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
  "use strict";
  return Controller.extend("project1.controller.Payment", {
    onInit: function () {
      var oPayTypeModel = new sap.ui.model.json.JSONModel({ selectedKey: "" });
      this.getView().setModel(oPayTypeModel, "payType");
    },
    onPayModeChange: function (oEvent) {
      var sKey = oEvent.getParameter("selectedItem").getKey();
      var oModel = this.getView().getModel("payType");
      oModel.setProperty("/selectedKey", sKey);
      this.byId("upiField").setValue("");
      this.byId("cardField").setValue("");
      this.byId("payBtn").setEnabled(false);
    },
    onInputChange: function () {
      var oView = this.getView();
      var sKey = oView.getModel("payType").getProperty("/selectedKey");
      var oInput = sKey === "upi" ? this.byId("upiField") : this.byId("cardField");
      var sValue = oInput ? oInput.getValue().trim() : "";
      this.byId("payBtn").setEnabled(!!sValue);
    },
    onPay: function () {
      var oCartModel = this.getOwnerComponent().getModel("cart");
      var aCartItems = oCartModel.getProperty("/items") || [];
      var total = oCartModel.getProperty("/total") || 0;
      if (aCartItems.length === 0) {
        MessageToast.show("Cart is empty!");
        return;
      }

      // Get current user
      var username = localStorage.getItem("username");
      if (!username) {
        MessageBox.error("Not logged in!");
        return;
      }

      // Load user's previous orders from localStorage (if any)
      var allOrders = JSON.parse(localStorage.getItem("orders_" + username) || "[]");

      // Create new order
      var newOrder = {
        id: "order_" + Date.now(),
        items: aCartItems,
        total: total,
        placedAt: new Date().toISOString()
      };

      // Add to user's orders and save
      allOrders.push(newOrder);
      localStorage.setItem("orders_" + username, JSON.stringify(allOrders));

      // Update the orders model (for UI)
      var oOrdersModel = this.getOwnerComponent().getModel("orders");
      oOrdersModel.setProperty("/orders", allOrders);

      // Clear cart
      oCartModel.setProperty("/items", []);
      oCartModel.setProperty("/total", 0);

      // Show success message
      MessageBox.success("Payment successful! Order placed.", {
        actions: ["Go to Home"],
        onClose: function (sAction) {
          if (sAction === "Go to Home") {
            this.getOwnerComponent().getRouter().navTo("RouteDashboard");
          }
        }.bind(this)
      });
    }
  });
});