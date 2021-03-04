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
      تصویر: "../assets/images/dashboard/product/1.jpg",
      "نام فایل": "2.jpg",
      آدرس: "http://www.assets/images/product/product/13.jpg",
    },
    {
      تصویر: "../assets/images/dashboard/product/2.jpg",
      "نام فایل": "2.jpeg",
      آدرس: "http://www.assets/images/electronics/product/12.jpg",
    },
    {
      تصویر: "../assets/images/dashboard/product/3.jpg",
      "نام فایل": "2.jpg",
      آدرس: "http://www.assets/images/electronics/product/25.jpg",
    },
    {
      تصویر: "../assets/images/dashboard/product/4.jpg",
      "نام فایل": "2.jpg",
      آدرس: "http://www.assets/images/electronics/product/16.jpg",
    },
    {
      تصویر: "../assets/images/dashboard/product/5.jpg",
      "نام فایل": "2.jpeg",
      آدرس: "http://www.assets/images/electronics/product/21.jpg",
    },
    {
      تصویر: "../assets/images/dashboard/product/6.jpg",
      "نام فایل": "2.jpeg",
      آدرس: "http://www.assets/images/electronics/product/3.jpg",
    },
    {
      تصویر: "../assets/images/dashboard/product/7.jpg",
      "نام فایل": "5.jpg",
      آدرس: "http://www.assets/images/electronics/product/14.jpg",
    },
    {
      تصویر: "../assets/images/dashboard/product/8.jpg",
      "نام فایل": "5.jpg",
      آدرس: "http://www.assets/images/electronics/product/20.jpg",
    },
    {
      تصویر: "../assets/images/dashboard/product/9.jpg",
      "نام فایل": "5.jpg",
      آدرس: "http://www.assets/images/electronics/product/19.jpg",
    },
    {
      تصویر: "../assets/images/dashboard/product/10.jpg",
      "نام فایل": "1.jpg",
      آدرس: "http://www.assets/images/jewellery/pro/18.jpg",
    },
    {
      تصویر: "../assets/images/dashboard/product/11.jpg",
      "نام فایل": "3.jpeg",
      آدرس: "http://www.assets/images/jewellery/pro/12.jpg",
    },
    {
      تصویر: "../assets/images/dashboard/product/12.jpg",
      "نام فایل": "26.jpeg",
      آدرس: "http://www.assets/images/jewellery/pro/26.jpg",
    },
    {
      تصویر: "../assets/images/dashboard/product/13.jpg",
      "نام فایل": "8.jpg",
      آدرس: "http://www.assets/images/furniture/8.jpg",
    },
    {
      تصویر: "../assets/images/dashboard/product/14.jpg",
      "نام فایل": "8.jpg",
      آدرس: "http://www.assets/images/cat3.png",
    },
    {
      تصویر: "../assets/images/dashboard/product/15.jpg",
      "نام فایل": "12.jpeg",
      آدرس: "http://www.assets/images/fashion/product/12.jpg",
    },
    {
      تصویر: "../assets/images/dashboard/product/16.jpg",
      "نام فایل": "16.jpg",
      آدرس: "http://www.assets/images/fashion/pro/shoes.jpg",
    },
    {
      تصویر: "../assets/images/dashboard/product/17.jpg",
      "نام فایل": "5.jpeg",
      آدرس: "http://www.assets/images/electronics/product/21.jpg",
    },
    {
      تصویر: "../assets/images/dashboard/product/18.jpg",
      "نام فایل": "8.jpg",
      آدرس: "http://www.assets/images/electronics/product/3.jpg",
    },
    {
      تصویر: "../assets/images/dashboard/product/19.jpg",
      "نام فایل": "9.jpg",
      آدرس: "http://www.assets/images/electronics/product/20.jpg",
    },
    {
      تصویر: "../assets/images/dashboard/product/20.jpg",
      "نام فایل": "5.jpg",
      آدرس: "http://www.assets/images/electronics/product/25.jpg",
    },
    {
      تصویر: "../assets/images/dashboard/product/1.jpg",
      "نام فایل": "4.jpeg",
      آدرس: "http://www.assets/images/fashion/pro/shoes.jpg",
    },
    {
      تصویر: "../assets/images/dashboard/product/2.jpg",
      "نام فایل": "5.jpg",
      آدرس: "http://www.assets/images/fashion/pro/06.jpg",
    },
    {
      تصویر: "../assets/images/dashboard/product/3.jpg",
      "نام فایل": "2.jpg",
      آدرس: "http://www.assets/images/electronics/product/9.jpg",
    },
    {
      تصویر: "../assets/images/dashboard/product/4.jpg",
      "نام فایل": "8.jpg",
      آدرس: "http://www.assets/images/electronics/product/6.jpg",
    },
    {
      تصویر: "../assets/images/dashboard/product/5.jpg",
      "نام فایل": "7.jpg",
      آدرس: "http://www.assets/images/jewellery/pro/12.jpg",
    },
    {
      تصویر: "../assets/images/dashboard/product/6.jpg",
      "نام فایل": "9.jpg",
      آدرس: "http://www.assets/images/electronics/product/13.jpg",
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
