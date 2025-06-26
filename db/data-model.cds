namespace sample;

entity Users {
  key ID          : UUID;
      email       : String(100);
      username    : String(50);
      mobilenumber: String(20);
      password    : String(255); // hashed
      createdAt   : Timestamp;
}

entity Orders {
  key ID      : UUID;
      user_ID : Association to Users;
      total   : Decimal(10,2);
      date    : Timestamp;
      items   : Composition of many OrderItems on items.order_ID = $self;
}

entity OrderItems {
  key ID      : UUID;
      order_ID: Association to Orders;
      name    : String(100);
      price   : Decimal(10,2);
      quantity: Integer;
      image   : String(512);
}
