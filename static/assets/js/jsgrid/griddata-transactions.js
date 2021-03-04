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
    upتاریخItem: function (updatingClient) {},

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
      "شماره سفارش": "142",
      "شناسه تراکنش": "#212145214510",
      تاریخ: "2-6-1399",
      "روش پرداخت": "پی پال",
      "وضعیت تحویل": "تحویل داده شد ",
      مبلغ: "120.000 تومان",
    },
    {
      "شماره سفارش": "217",
      "شناسه تراکنش": "#784561421721",
      تاریخ: "2-6-1399",
      "روش پرداخت": "نوار",
      "وضعیت تحویل": "در انتظار  ",
      مبلغ: "120.000 تومان",
    },
    {
      "شماره سفارش": "546",
      "شناسه تراکنش": "#476547821142",
      تاریخ: "2-6-1399",
      "روش پرداخت": "نوار",
      "وضعیت تحویل": "تحویل داده شد ",
      مبلغ: "120.000 تومان",
    },
    {
      "شماره سفارش": "671",
      "شناسه تراکنش": "#745384127541",
      تاریخ: "2-6-1399",
      "روش پرداخت": "پی پال",
      "وضعیت تحویل": "تحویل داده شد ",
      مبلغ: "120.000 تومان",
    },
    {
      "شماره سفارش": "565",
      "شناسه تراکنش": "#96725125102",
      تاریخ: "2-6-1399",
      "روش پرداخت": "نوار",
      "وضعیت تحویل": "در انتظار  ",
      مبلغ: "120.000 تومان",
    },
    {
      "شماره سفارش": "754",
      "شناسه تراکنش": "#547121023651",
      تاریخ: "2-6-1399",
      "روش پرداخت": "پی پال",
      "وضعیت تحویل": "تحویل داده شد ",
      مبلغ: "120.000 تومان",
    },
    {
      "شماره سفارش": "164",
      "شناسه تراکنش": "#876412242215",
      تاریخ: "2-6-1399",
      "روش پرداخت": "نوار",
      "وضعیت تحویل": "تحویل داده شد",
      مبلغ: "120.000 تومان",
    },
    {
      "شماره سفارش": "841",
      "شناسه تراکنش": "#31534221621",
      تاریخ: "2-6-1399",
      "روش پرداخت": "پی پال",
      "وضعیت تحویل": "در انتظار  ",
      مبلغ: "120.000 تومان",
    },
    {
      "شماره سفارش": "354",
      "شناسه تراکنش": "#78412457421",
      تاریخ: "2-6-1399",
      "روش پرداخت": "پی پال",
      "وضعیت تحویل": "تحویل داده شد ",
      مبلغ: "120.000 تومان",
    },
    {
      "شماره سفارش": "784",
      "شناسه تراکنش": "#241524757448",
      تاریخ: "2-6-1399",
      "روش پرداخت": "نوار",
      "وضعیت تحویل": "تحویل داده شد ",
      مبلغ: "120.000 تومان",
    },
    {
      "شماره سفارش": "142",
      "شناسه تراکنش": "#212145214510",
      تاریخ: "2-6-1399",
      "روش پرداخت": "پی پال",
      "وضعیت تحویل": "تحویل داده شد ",
      مبلغ: "120.000 تومان",
    },
    {
      "شماره سفارش": "217",
      "شناسه تراکنش": "#784561421721",
      تاریخ: "2-6-1399",
      "روش پرداخت": "نوار",
      "وضعیت تحویل": "در انتظار  ",
      مبلغ: "120.000 تومان",
    },
    {
      "شماره سفارش": "546",
      "شناسه تراکنش": "#476547821142",
      تاریخ: "2-6-1399",
      "روش پرداخت": "نوار",
      "وضعیت تحویل": "تحویل داده شد ",
      مبلغ: "120.000 تومان",
    },
    {
      "شماره سفارش": "671",
      "شناسه تراکنش": "#745384127541",
      تاریخ: "2-6-1399",
      "روش پرداخت": "پی پال",
      "وضعیت تحویل": "تحویل داده شد ",
      مبلغ: "120.000 تومان",
    },
    {
      "شماره سفارش": "565",
      "شناسه تراکنش": "#96725125102",
      تاریخ: "2-6-1399",
      "روش پرداخت": "نوار",
      "وضعیت تحویل": "در انتظار  ",
      مبلغ: "120.000 تومان",
    },
  ];
  db.users = [
    {
      ID: "x",
      Account: "A758A693-0302-03D1-AE53-EEFE22855556",
      "شماره سفارش": "Carson Kelley",
      Registerتاریخ: "2002-04-20T22:55:52-07:00",
    },
    {
      Account: "D89FF524-1233-0CE7-C9E1-56EFF017A321",
      "شماره سفارش": "Prescott Griffin",
      Registerتاریخ: "2011-02-22T05:59:55-08:00",
    },
  ];
})();
