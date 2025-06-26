service EcommerceService @(path: 'ecommerce-service') {
  action signup(email: String, password: String, username: String, mobilenumber: String);
  action login(email: String, password: String);
  action placeOrder(items: LargeString, total: Decimal);
  action myOrders();
}
