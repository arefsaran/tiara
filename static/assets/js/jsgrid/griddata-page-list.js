"use strict";
(function () {
  var db = {
    loadData: function (filter) {
      return $.grep(this.clients, function (client) {
        return (
          (!filter.نام || client.نام.indexOf(filter.نام) > -1) &&
          (!filter.Action || client.Action === filter.Action) &&
          (!filter.stock || client.stock.indexOf(filter.stock) > -1) &&
          (!filter.Attribute || client.Attribute === filter.Attribute) &&
          (filter.Married === undefined || client.Married === filter.Married)
        );
      });
    },
    insertItem: function (insertingClient) {
      this.clients.push(insertingClient);
    },
    updateItem: function (updatingClient) {},

    deleteItem: function (deletingClient) {
      var clientIndex = $.inArray(deletingClient, this.clients);
      this.clients.splice(clientIndex, 1);
    },
  };
  window.db = db;
  db.countries = [
    { نام: "India", Id: 0 },
    { نام: "United States", Id: 1 },
    { نام: "Canada", Id: 2 },
    { نام: "United Kingdom", Id: 3 },
    { نام: "France", Id: 4 },
    { نام: "Brazil", Id: 5 },
    { نام: "China", Id: 6 },
    { نام: "Russia", Id: 7 },
  ];
  db.clients = [
    {
      نام: "لیست محصولات",
      وضعیت: '<i class="fa fa-circle font-warning f-12"></i>',
      "ایجاد شده است": "1-6-1399",
    },
    {
      نام: "محصول دیجیتال",
      وضعیت: '<i class="fa fa-circle font-danger f-12"></i>',
      "ایجاد شده است": "1-6-1399",
    },
    {
      نام: "رسانه کاربر",
      وضعیت: '<i class="fa fa-circle font-success f-12"></i>',
      "ایجاد شده است": "1-6-1399",
    },
    {
      نام: "درباره محصول",
      وضعیت: '<i class="fa fa-circle font-success f-12"></i>',
      "ایجاد شده است": "1-6-1399",
    },
    {
      نام: "مشخصات کاربر",
      وضعیت: '<i class="fa fa-circle font-warning f-12"></i>',
      "ایجاد شده است": "1-6-1399",
    },
    {
      نام: "محصول تخفیف",
      وضعیت: '<i class="fa fa-circle font-danger f-12"></i>',
      "ایجاد شده است": "1-6-1399",
    },
    {
      نام: "درباره فاکتور",
      وضعیت: '<i class="fa fa-circle font-success f-12"></i>',
      "ایجاد شده است": "1-6-1399",
    },
  ];
  db.users = [
    {
      ID: "x",
      Account: "A758A693-0302-03D1-AE53-EEFE22855556",
      نام: "Carson Kelley",
      RegisterDate: "2002-04-20T22:55:52-07:00",
    },
    {
      Account: "D89FF524-1233-0CE7-C9E1-56EFF017A321",
      نام: "Prescott Griffin",
      RegisterDate: "2011-02-22T05:59:55-08:00",
    },
  ];
})();
