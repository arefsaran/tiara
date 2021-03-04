"use strict";
(function () {
  var db = {
    loadData: function (filter) {
      return $.grep(this.clients, function (client) {
        return (
          (!filter.Name || client.Name.indexOf(filter.Name) > -1) &&
          (!filter.Action || client.Action === filter.Action) &&
          (!filter.ProductCategory ||
            client.ProductCategory.indexOf(filter.ProductCategory) > -1) &&
          (!filter.ProductsubCategory ||
            client.ProductsubCategory === filter.ProductsubCategory) &&
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
    { Name: "India", Id: 0 },
    { Name: "United States", Id: 1 },
    { Name: "Canada", Id: 2 },
    { Name: "United Kingdom", Id: 3 },
    { Name: "France", Id: 4 },
    { Name: "Brazil", Id: 5 },
    { Name: "China", Id: 6 },
    { Name: "Russia", Id: 7 },
  ];
  db.clients = [
    {
      "عنوان ارز": "دلار آمریکا",
      "دلار آمریکا": "2.4512478",
      کد: "دلار آمریکا",
      "قیمت ارز": "0.57912364",
    },
    {
      "عنوان ارز": "افغانستان",
      "دلار آمریکا": "5.14761214",
      کد: "ریال",
      "قیمت ارز": "1.05761432",
    },
    {
      "عنوان ارز": "درهم امارات متحده عربی",
      "دلار آمریکا": "12.02646581",
      کد: "امارات",
      "قیمت ارز": "0.15642465",
    },
    {
      "عنوان ارز": "اتحادیه اروپا",
      "دلار آمریکا": "8.124712425",
      کد: "یورو",
      "قیمت ارز": "0.187541231",
    },
    {
      "عنوان ارز": "ژاپن",
      "دلار آمریکا": "10.78422121",
      کد: "دلار",
      "قیمت ارز": "3.8425110221",
    },
    {
      "عنوان ارز": "پوند انگلیس بزرگ",
      "دلار آمریکا": "7.1246121152",
      کد: "پوند",
      "قیمت ارز": "0.25522648",
    },
  ];
  db.users = [
    {
      ID: "x",
      Account: "A758A693-0302-03D1-AE53-EEFE22855556",
      "Product Title": "Carson Kelley",
      RegisterDate: "2002-04-20T22:55:52-07:00",
    },
    {
      Account: "D89FF524-1233-0CE7-C9E1-56EFF017A321",
      "Product Title": "Prescott Griffin",
      RegisterDate: "2011-02-22T05:59:55-08:00",
    },
  ];
})();
