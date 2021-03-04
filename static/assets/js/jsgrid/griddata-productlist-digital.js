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
    { Name: "India", شماره: 0 },
    { Name: "United States", شماره: 1 },
    { Name: "Canada", شماره: 2 },
    { Name: "United Kingdom", شماره: 3 },
    { Name: "France", شماره: 4 },
    { Name: "Brazil", شماره: 5 },
    { Name: "China", شماره: 6 },
    { Name: "Russia", شماره: 7 },
  ];
  db.clients = [
    {
      شماره: "21",
      محصول: "../assets/images/digital-product/web-dev.jpg",
      "نام محصول": "وب سایتها",
      "نوع ورودی": "اضافه",
      تعداد: "5",
    },
    {
      شماره: "172",
      محصول: "../assets/images/digital-product/3d-design.jpg",
      "نام محصول": "تأثیر سه بعدی",
      "نوع ورودی": "حذف",
      تعداد: "11",
    },
    {
      شماره: "124",
      محصول: "../assets/images/digital-product/graphic-design.png",
      "نام محصول": "طراحی گرافیک",
      "نوع ورودی": "حذف",
      تعداد: "154",
    },
    {
      شماره: "37",
      محصول: "../assets/images/digital-product/logo.jpg",
      "نام محصول": "آرم شرکت",
      "نوع ورودی": "حذف",
      تعداد: "1",
    },
    {
      شماره: "67",
      محصول: "../assets/images/digital-product/application.jpg",
      "نام محصول": "کاربرد",
      "نوع ورودی": "اضافه",
      تعداد: "24",
    },
    {
      شماره: "74",
      محصول: "../assets/images/digital-product/php.png",
      "نام محصول": "پی اچ پی",
      "نوع ورودی": "حذف",
      تعداد: "1",
    },
    {
      شماره: "427",
      محصول: "../assets/images/digital-product/html.png",
      "نام محصول": "Html",
      "نوع ورودی": "حذف",
      تعداد: "27",
    },
    {
      شماره: "142",
      محصول: "../assets/images/digital-product/css.jpg",
      "نام محصول": "Css",
      "نوع ورودی": "اضافه",
      تعداد: "2",
    },
    {
      شماره: "58",
      محصول: "../assets/images/digital-product/ebooks.png",
      "نام محصول": "کتابهای الکترونیکی",
      "نوع ورودی": "اضافه",
      تعداد: "4",
    },
  ];
  db.users = [
    {
      شماره: "x",
      Account: "A758A693-0302-03D1-AE53-EEFE22855556",
      "نام محصول": "Carson Kelley",
      RegisterDate: "2002-04-20T22:55:52-07:00",
    },
    {
      Account: "D89FF524-1233-0CE7-C9E1-56EFF017A321",
      "نام محصول": "Prescott Griffin",
      RegisterDate: "2011-02-22T05:59:55-08:00",
    },
  ];
})();
