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

      this.byId("upiField")?.setValue("");
      this.byId("cardName")?.setValue("");
      this.byId("cardNumber")?.setValue("");
      this.byId("cardExpiry")?.setValue("");
      this.byId("cardCVV")?.setValue("");

      this.byId("payBtn").setEnabled(false);
      this.byId("payBtnFooter").setEnabled(false);
    },

    onInputChange: function () {
      var sKey = this.getView().getModel("payType").getProperty("/selectedKey");
      var bValid = false;

      if (sKey === "upi") {
        var upi = this.byId("upiField").getValue().trim();
        bValid = /^[\w.-]+@[\w.-]+$/.test(upi);
      } else if (sKey === "card") {
        var name = this.byId("cardName").getValue().trim();
        var number = this.byId("cardNumber").getValue().trim();
        var expiry = this.byId("cardExpiry").getValue().trim();
        var cvv = this.byId("cardCVV").getValue().trim();

        bValid =
          name.length > 0 &&
          /^\d{16}$/.test(number) &&
          /^\d{2}\/\d{2}$/.test(expiry) &&
          /^\d{3}$/.test(cvv);
      }

      this.byId("payBtn").setEnabled(bValid);
      this.byId("payBtnFooter").setEnabled(bValid);
    },

    onPay: function () {
      var oCartModel = this.getOwnerComponent().getModel("cart");
      var aCartItems = oCartModel.getProperty("/items") || [];
      var total = oCartModel.getProperty("/total") || 0;

      if (aCartItems.length === 0) {
        MessageToast.show("Cart is empty!");
        return;
      }

      var username = localStorage.getItem("username");
      if (!username) {
        MessageBox.error("Not logged in!");
        return;
      }

      var allOrders = JSON.parse(localStorage.getItem("orders_" + username) || "[]");

      var newOrder = {
        id: "order_" + Date.now(),
        items: aCartItems,
        total: total,
        placedAt: new Date().toISOString()
      };

      allOrders.push(newOrder);
      localStorage.setItem("orders_" + username, JSON.stringify(allOrders));

      var oOrdersModel = this.getOwnerComponent().getModel("orders");
      oOrdersModel.setProperty("/orders", allOrders);

      oCartModel.setProperty("/items", []);
      oCartModel.setProperty("/total", 0);

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
