sap.ui.define([
  "sap/ui/core/mvc/Controller", 
  "sap/ui/model/json/JSONModel", 
  "sap/m/MessageToast"
], function(Controller, JSONModel, MessageToast) {
  "use strict";
  return Controller.extend("project1.controller.Orders", {
    onInit: function() {
      var username = localStorage.getItem("username");
      if (!username) {
        MessageToast.show("Please login");
        return;
      }
      // Load orders for this user from localStorage
      var allOrders = JSON.parse(localStorage.getItem("orders_" + username) || "[]");
      // Set as model for the view
      var model = new JSONModel({ orders: allOrders });
      this.getView().setModel(model, "orders");
    },
    formatDate: function(dateStr) {
      if (!dateStr) return "";
      var date = new Date(dateStr);
      return date.toLocaleString(); // You can format as you like
    },
    onNavToDashboard: function() {
      this.getOwnerComponent().getRouter().navTo("RouteDashboard");
    },
    onNavToCart: function() {
      this.getOwnerComponent().getRouter().navTo("RouteCart");
    }
  });
});