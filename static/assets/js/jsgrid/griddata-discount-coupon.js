"use strict";
(function () {
  var db = {
    loadData: function (filter) {
      return $.grep(this.clients, function (client) {
        return (
          (!filter.Name || client.Name.indexOf(filter.Name) > -1) &&
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
      عنوان: " 10% تخفیف",
      کد: " درصد10",
      تخفیف: " 10%",
      وضعیت: '<i class="fa fa-circle font-success f-12"></i>',
    },
    {
      عنوان: " 25% تخفیف",
      کد: " درصد25",
      تخفیف: " 25%",
      وضعیت: '<i class="fa fa-circle font-warning f-12"></i>',
    },
    {
      عنوان: " 5% تخفیف",
      کد: " درصد5",
      تخفیف: " 5%",
      وضعیت: '<i class="fa fa-circle font-success f-12"></i>',
    },
    {
      عنوان: " 2% تخفیف",
      کد: " درصد2",
      تخفیف: " 2%",
      وضعیت: '<i class="fa fa-circle font-warning f-12"></i>',
    },
    {
      عنوان: " 50% تخفیف",
      کد: " درصد50",
      تخفیف: " 50%",
      وضعیت: '<i class="fa fa-circle font-danger f-12"></i>',
    },
    {
      عنوان: " 70% تخفیف",
      کد: " درصد70",
      تخفیف: " 70%",
      وضعیت: '<i class="fa fa-circle font-success f-12"></i>',
    },
    {
      عنوان: " 75% تخفیف",
      کد: " درصد75",
      تخفیف: " 75%",
      وضعیت: '<i class="fa fa-circle font-danger f-12"></i>',
    },
    {
      عنوان: " 80% تخفیف",
      کد: " درصد80",
      تخفیف: " 80%",
      وضعیت: '<i class="fa fa-circle font-success f-12"></i>',
    },
  ];
  db.users = [
    {
      ID: "x",
      Account: "A758A693-0302-03D1-AE53-EEFE22855556",
      Name: "Carson Kelley",
      RegisterDate: "2002-04-20T22:55:52-07:00",
    },
    {
      Account: "D89FF524-1233-0CE7-C9E1-56EFF017A321",
      Name: "Prescott Griffin",
      RegisterDate: "2011-02-22T05:59:55-08:00",
    },
  ];
})();
