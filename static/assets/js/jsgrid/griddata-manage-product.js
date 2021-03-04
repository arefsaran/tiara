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
      تصویر: "../assets/images/dashboard/product/1.jpg",
      نام: "هدفون",
      قیمت: "250.000 تومان",
      وضعیت: '<i class="fa fa-circle font-success f-12"></i>',
      "دسته بندی": "الکترونیک",
    },
    {
      تصویر: "../assets/images/dashboard/product/2.jpg",
      نام: "موبایل",
      قیمت: "250.000 تومان",
      وضعیت: '<i class="fa fa-circle font-success f-12"></i>',
      "دسته بندی": "الکترونیک",
    },
    {
      تصویر: "../assets/images/dashboard/product/3.jpg",
      نام: "تلویزیون ال ای دی سامسونگ",
      قیمت: "250.000 تومان",
      وضعیت: '<i class="fa fa-circle font-warning f-12"></i>',
      "دسته بندی": "الکترونیک",
    },
    {
      تصویر: "../assets/images/dashboard/product/4.jpg",
      نام: "موتورولا بلوتوث",
      قیمت: "250.000 تومان",
      وضعیت: '<i class="fa fa-circle font-success f-12"></i>',
      "دسته بندی": "الکترونیک",
    },
    {
      تصویر: "../assets/images/dashboard/product/5.jpg",
      نام: "اپل",
      قیمت: "250.000 تومان",
      وضعیت: '<i class="fa fa-circle font-danger f-12"></i>',
      "دسته بندی": "الکترونیک",
    },
    {
      تصویر: "../assets/images/dashboard/product/6.jpg",
      نام: "چاپگر",
      قیمت: "250.000 تومان",
      وضعیت: '<i class="fa fa-circle font-warning f-12"></i>',
      "دسته بندی": "الکترونیک",
    },
    {
      تصویر: "../assets/images/dashboard/product/7.jpg",
      نام: "دوربین کانن",
      قیمت: "250.000 تومان",
      وضعیت: '<i class="fa fa-circle font-success f-12"></i>',
      "دسته بندی": "الکترونیک",
    },
    {
      تصویر: "../assets/images/dashboard/product/8.jpg",
      نام: "هدفون با کیفیت بالا",
      قیمت: "250.000 تومان",
      وضعیت: '<i class="fa fa-circle font-danger f-12"></i>',
      "دسته بندی": "الکترونیک",
    },
    {
      تصویر: "../assets/images/dashboard/product/9.jpg",
      نام: "بلندگوهای سینمای خانگی",
      قیمت: "250.000 تومان",
      وضعیت: '<i class="fa fa-circle font-success f-12"></i>',
      "دسته بندی": "الکترونیک",
    },
    {
      تصویر: "../assets/images/dashboard/product/10.jpg",
      نام: "حلقه الماس",
      قیمت: "250.000 تومان",
      وضعیت: '<i class="fa fa-circle font-warning f-12"></i>',
      "دسته بندی": "جواهرات",
    },
    {
      تصویر: "../assets/images/dashboard/product/11.jpg",
      نام: "ناخن الماس",
      قیمت: "250.000 تومان",
      وضعیت: '<i class="fa fa-circle font-warning f-12"></i>',
      "دسته بندی": "جواهرات",
    },
    {
      تصویر: "../assets/images/dashboard/product/12.jpg",
      نام: "گوشواره های الماس",
      قیمت: "250.000 تومان",
      وضعیت: '<i class="fa fa-circle font-success f-12"></i>',
      "دسته بندی": "جواهرات",
    },
    {
      تصویر: "../assets/images/dashboard/product/13.jpg",
      نام: "چراغ شب",
      قیمت: "250.000 تومان",
      وضعیت: '<i class="fa fa-circle font-success"></i>',
      "دسته بندی": "مبلمان",
    },
    {
      تصویر: "../assets/images/dashboard/product/14.jpg",
      نام: "کفش",
      قیمت: "250.000 تومان",
      وضعیت: '<i class="fa fa-circle font-warning f-12"></i>',
      "دسته بندی": "کفش",
    },
    {
      تصویر: "../assets/images/dashboard/product/15.jpg",
      نام: "لباس",
      قیمت: "250.000 تومان",
      وضعیت: '<i class="fa fa-circle font-success f-12"></i>',
      "دسته بندی": "لباس ها",
    },
    {
      تصویر: "../assets/images/dashboard/product/16.jpg",
      نام: "کفش",
      قیمت: "250.000 تومان",
      وضعیت: '<i class="fa fa-circle font-success f-12"></i>',
      "دسته بندی": "کفش",
    },
    {
      تصویر: "../assets/images/dashboard/product/17.jpg",
      نام: "لباس",
      قیمت: "250.000 تومان",
      وضعیت: '<i class="fa fa-circle font-danger f-12"></i>',
      "دسته بندی": "لباس ها",
    },
    {
      تصویر: "../assets/images/dashboard/product/18.jpg",
      نام: "ماوس",
      قیمت: "250.000 تومان",
      وضعیت: '<i class="fa fa-circle font-success f-12"></i>',
      "دسته بندی": "الکترونیک",
    },
    {
      تصویر: "../assets/images/dashboard/product/19.jpg",
      نام: "قهوه ساز",
      قیمت: "250.000 تومان",
      وضعیت: '<i class="fa fa-circle font-danger f-12"></i>',
      "دسته بندی": "الکترونیک",
    },
    {
      تصویر: "../assets/images/dashboard/product/20.jpg",
      نام: "ناخن الماس",
      قیمت: "250.000 تومان",
      وضعیت: '<i class="fa fa-circle font-warning f-12"></i>',
      "دسته بندی": "جواهرات",
    },
    {
      تصویر: "../assets/images/dashboard/product/1.jpg",
      نام: "موبایل",
      قیمت: "250.000 تومان",
      وضعیت: '<i class="fa fa-circle font-success f-12"></i>',
      "دسته بندی": "الکترونیک",
    },
    {
      تصویر: "../assets/images/dashboard/product/2.jpg",
      نام: "موبایل",
      قیمت: "250.000 تومان",
      وضعیت: '<i class="fa fa-circle font-warning f-12"></i>',
      "دسته بندی": "الکترونیک",
    },
    {
      تصویر: "../assets/images/dashboard/product/15.jpg",
      نام: "چاپگر",
      قیمت: "250.000 تومان",
      وضعیت: '<i class="fa fa-circle font-success f-12"></i>',
      "دسته بندی": "الکترونیک",
    },
    {
      تصویر: "../assets/images/dashboard/product/16.jpg",
      نام: "هدفون",
      قیمت: "250.000 تومان",
      وضعیت: '<i class="fa fa-circle font-danger f-12"></i>',
      "دسته بندی": "الکترونیک",
    },
    {
      تصویر: "../assets/images/dashboard/product/17.jpg",
      نام: "بلوتوث",
      قیمت: "250.000 تومان",
      وضعیت: '<i class="fa fa-circle font-success f-12"></i>',
      "دسته بندی": "الکترونیک",
    },
    {
      تصویر: "../assets/images/dashboard/product/18.jpg",
      نام: "کفش",
      قیمت: "250.000 تومان",
      وضعیت: '<i class="fa fa-circle font-success f-12"></i>',
      "دسته بندی": "کفش",
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
