"use strict";
(function () {
  var db = {
    loadData: function (filter) {
      return $.grep(this.clients, function (client) {
        return (
          (!filter.Name || client.Name.indexOf(filter.Name) > -1) &&
          (!filter.Action || client.Action === filter.Action) &&
          (!filter.Addedby || client.Addedby.indexOf(filter.Addedby) > -1) &&
          (!filter.vendortype || client.vendortype === filter.vendortype) &&
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
      نام: "الکساندر",
      "شناسه انتقال": "14783112",
      تاریخ: "23-6-1399",
      جمع: "100.000 تومان",
    },
    {
      نام: "الکساندر",
      "شناسه انتقال": "87541221",
      تاریخ: "23-6-1399",
      جمع: "100.000 تومان",
    },
    {
      نام: "الکساندر",
      "شناسه انتقال": "213514462",
      تاریخ: "23-6-1399",
      جمع: "100.000 تومان",
    },
    {
      نام: "الکساندر",
      "شناسه انتقال": "7512785568",
      تاریخ: "23-6-1399",
      جمع: "100.000 تومان",
    },
    {
      نام: "الکساندر",
      "شناسه انتقال": "7614585124",
      تاریخ: "23-6-1399",
      جمع: "100.000 تومان",
    },
    {
      نام: "الکساندر",
      "شناسه انتقال": "574225447",
      تاریخ: "23-6-1399",
      جمع: "100.000 تومان",
    },
    {
      نام: "الکساندر",
      "شناسه انتقال": "235896144",
      تاریخ: "23-6-1399",
      جمع: "100.000 تومان",
    },
    {
      نام: "الکساندر",
      "شناسه انتقال": "5781425474",
      تاریخ: "23-6-1399",
      جمع: "100.000 تومان",
    },
    {
      نام: "الکساندر",
      "شناسه انتقال": "636512214",
      تاریخ: "23-6-1399",
      جمع: "100.000 تومان",
    },
    {
      نام: "الکساندر",
      "شناسه انتقال": "461178242",
      تاریخ: "23-6-1399",
      جمع: "100.000 تومان",
    },
    {
      نام: "الکساندر",
      "شناسه انتقال": "548212314",
      تاریخ: "23-6-1399",
      جمع: "100.000 تومان",
    },
    {
      نام: "الکساندر",
      "شناسه انتقال": "6124612367",
      تاریخ: "23-6-1399",
      جمع: "100.000 تومان",
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
