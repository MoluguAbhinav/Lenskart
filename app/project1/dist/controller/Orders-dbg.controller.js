sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/m/MessageToast"
  ], function(Controller, JSONModel, MessageToast) {
    "use strict";
    return Controller.extend("project1.controller.Orders", {
      onInit: function() {
        var jwt = localStorage.getItem("jwt");
        if (!jwt) return MessageToast.show("Please login");
        fetch("/ecommerce-service/myOrders", {
          headers: { "Authorization": "Bearer " + jwt }
        })
        .then(r => r.ok ? r.json() : [])
        .then(data => {
          var model = new JSONModel({ orders: data });
          this.getView().setModel(model, "orders");
        });
      },
      onNavToDashboard: function() {
        this.getOwnerComponent().getRouter().navTo("RouteDashboard");
      },
      onNavToCart: function() {
        this.getOwnerComponent().getRouter().navTo("RouteCart");
      }
    });
  });
  