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
      تصویر: "../assets/images/digital-product/graphic-design.png",
      نام: "طراحی گرافیک",
      قیمت: "125.000 تومان",
      وضعیت: '<i class="fa fa-circle font-success f-12"></i>',
      "دسته بندی": "دیجیتال",
    },
    {
      تصویر: "../assets/images/digital-product/ebooks.png",
      نام: "کتابهای الکترونیکی",
      قیمت: "125.000 تومان",
      وضعیت: '<i class="fa fa-circle font-warning f-12"></i>',
      "دسته بندی": "دیجیتال",
    },
    {
      تصویر: "../assets/images/digital-product/lecture-video-recorder.jpg",
      نام: "سخنرانی های ضبط شده",
      قیمت: "125.000 تومان",
      وضعیت: '<i class="fa fa-circle font-success f-12"></i>',
      "دسته بندی": "دیجیتال",
    },
    {
      تصویر: "../assets/images/digital-product/application.jpg",
      نام: "کاربرد",
      قیمت: "125.000 تومان",
      وضعیت: '<i class="fa fa-circle font-danger f-12"></i>',
      "دسته بندی": "دیجیتال",
    },
    {
      تصویر: "../assets/images/digital-product/web-dev.jpg",
      نام: "وب سایتها",
      قیمت: "125.000 تومان",
      وضعیت: '<i class="fa fa-circle font-warning f-12"></i>',
      "دسته بندی": "دیجیتال",
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
