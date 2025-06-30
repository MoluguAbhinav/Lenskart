sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/m/MessageBox"
  ], function(Controller, MessageToast, MessageBox) {
    "use strict";
    return Controller.extend("project1.controller.Login", {
      onLogin: function() {
        var email = this.byId("email1").getValue().trim();
        var password = this.byId("password1").getValue();
        if (!email || !password)
          return MessageBox.error("Please enter email and password.");
        fetch("/odata/v4/ecommerce/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        })
        .then(r => r.ok ? r.json() : r.json().then(e => Promise.reject(e)))
        .then(data => {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("username", data.username);
          MessageToast.show("Login successful!");
          sap.ui.core.UIComponent.getRouterFor(this).navTo("RouteDashboard");
        })
        .catch(err => MessageBox.error("Login failed: " + ((err && err.error && err.error.message) || "Unknown")));
      },
      onSignupNav: function() {
        sap.ui.core.UIComponent.getRouterFor(this).navTo("RouteSignup");
      }
    });
  });
