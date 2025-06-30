sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function(Controller, MessageToast, MessageBox) {
  "use strict";
  return Controller.extend("sample.controller.Signup", {
      onSignup: function() {
          var oView = this.getView();
          var email = oView.byId("email").getValue().trim();
          var username = oView.byId("username").getValue().trim();
          var mobilenumber = oView.byId("mobilenumber").getValue().trim();
          var password = oView.byId("password").getValue();
          var confirmpassword = oView.byId("confirmpassword").getValue();
          if (!email || !username || !mobilenumber || !password || !confirmpassword)
              return MessageBox.error("Please fill in all fields.");
          if (password !== confirmpassword)
              return MessageBox.error("Passwords do not match.");
          fetch("/odata/v4/ecommerce/signup", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, username, mobilenumber, password })
          })
          .then(r => r.ok ? r.json() : r.json().then(e => Promise.reject(e)))
          .then(() => {
              MessageToast.show("Signup successful! Please login.");
              sap.ui.core.UIComponent.getRouterFor(this).navTo("RouteLogin");
          })
          .catch(err => MessageBox.error("Signup failed: " + ((err && err.error && err.error.message) || "Unknown")));
      },
      onSignInNav: function() {
          sap.ui.core.UIComponent.getRouterFor(this).navTo("RouteLogin");
      }
  });
});