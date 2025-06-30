using { sample } from '../db/data-model';

service ecommerce {
  entity Users      as projection on sample.Users;
  entity Orders     as projection on sample.Orders;
  entity OrderItems as projection on sample.OrderItems;

  action signup(
    email: String,
    password: String,
    username: String,
    mobilenumber: String
  ) returns { success: Boolean; }; // <--- add this!
  action login(
  email: String,
  password: String
) returns {
  token: String;
  username: String;
};
  action placeOrder(
    items: many {
      name    : String(100);
      price   : Decimal(10,2);
      quantity: Integer;
      image   : String(512);
    },
    total: Decimal(10,2)
  );
  action myOrders();
}