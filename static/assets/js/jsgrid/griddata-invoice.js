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
      ردیف: "1",
      صورتحساب: "50764",
      تاریخ: "1/1/1399",
      حمل: "3.62",
      میزان: "816",
      مالیات: "65.28",
      جمع: "884.16",
    },
    {
      ردیف: "2",
      صورتحساب: "50765",
      تاریخ: "1/1/1399",
      حمل: "8.4",
      میزان: "146",
      مالیات: "70",
      جمع: "225.4",
    },

    {
      ردیف: "3",
      صورتحساب: "50766",
      تاریخ: "1/1/1399",
      حمل: "7.3",
      میزان: "47",
      مالیات: "724",
      جمع: "789",
    },
    {
      ردیف: "4",
      صورتحساب: "50767",
      تاریخ: "1/1/1399",
      حمل: "2.00",
      میزان: "478",
      مالیات: "35",
      جمع: "512",
    },
    {
      ردیف: "5",
      صورتحساب: "50768",
      تاریخ: "1/1/1399",
      حمل: "1.5",
      میزان: "1460",
      مالیات: "45.32",
      جمع: "1515",
    },
    {
      ردیف: "6",
      صورتحساب: "50769",
      تاریخ: "1/1/1399",
      حمل: "8.45",
      میزان: "768",
      مالیات: "17",
      جمع: "780",
    },
    {
      ردیف: "7",
      صورتحساب: "50770",
      تاریخ: "1/1/1399",
      حمل: "25.8",
      میزان: "874",
      مالیات: "27.2",
      جمع: "945.10",
    },
    {
      ردیف: "8",
      صورتحساب: "50771",
      تاریخ: "1/1/1399",
      حمل: "17.2",
      میزان: "671",
      مالیات: "83.7",
      جمع: "775.9",
    },
    {
      ردیف: "9",
      صورتحساب: "50772",
      تاریخ: "12/5/1399",
      حمل: "87.5",
      میزان: "572",
      مالیات: "8.70",
      جمع: "615",
    },
    {
      ردیف: "10",
      صورتحساب: "50773",
      تاریخ: "16/5/1399",
      حمل: "78.12",
      میزان: "489",
      مالیات: "10.57",
      جمع: "516",
    },
    {
      ردیف: "11",
      صورتحساب: "50774",
      تاریخ: "20/5/1399",
      حمل: "57.56",
      میزان: "800",
      مالیات: "78.2",
      جمع: "975",
    },
    {
      ردیف: "12",
      صورتحساب: "50775",
      تاریخ: "22/5/1399",
      حمل: "40.17",
      میزان: "867",
      مالیات: "57.2",
      جمع: "945",
    },
    {
      ردیف: "13",
      صورتحساب: "50776",
      تاریخ: "25/5/1399",
      حمل: "80.04",
      میزان: "4782",
      مالیات: "47.5",
      جمع: "5354",
    },
    {
      ردیف: "14",
      صورتحساب: "50777",
      تاریخ: "27/5/1399",
      حمل: "6.15",
      میزان: "576",
      مالیات: "4.48",
      جمع: "599",
    },
    {
      ردیف: "15",
      صورتحساب: "50778",
      تاریخ: "29/5/1399",
      حمل: "8.67",
      میزان: "875",
      مالیات: "56.78",
      جمع: "987",
    },
    {
      ردیف: "16",
      صورتحساب: "50779",
      تاریخ: "5/6/1399",
      حمل: "7.88",
      میزان: "547",
      مالیات: "5.72",
      جمع: "600",
    },
    {
      ردیف: "17",
      صورتحساب: "50780",
      تاریخ: "8/6/1399",
      حمل: "3.14",
      میزان: "781",
      مالیات: "23.47",
      جمع: "817",
    },

    {
      ردیف: "18",
      صورتحساب: "50781",
      تاریخ: "14/6/1399",
      حمل: "7.3",
      میزان: "47",
      مالیات: "724",
      جمع: "789",
    },
    {
      ردیف: "19",
      صورتحساب: "50782",
      تاریخ: "18/6/1399",
      حمل: "2.00",
      میزان: "478",
      مالیات: "35",
      جمع: "512",
    },
    {
      ردیف: "20",
      صورتحساب: "50783",
      تاریخ: "21/6/1399",
      حمل: "1.5",
      میزان: "1460",
      مالیات: "45.32",
      جمع: "1515",
    },
    {
      ردیف: "21",
      صورتحساب: "50784",
      تاریخ: "23/6/1399",
      حمل: "8.45",
      میزان: "768",
      مالیات: "17",
      جمع: "780",
    },
    {
      ردیف: "22",
      صورتحساب: "50785",
      تاریخ: "26/6/1399",
      حمل: "25.8",
      میزان: "874",
      مالیات: "27.2",
      جمع: "945.10",
    },
    {
      ردیف: "23",
      صورتحساب: "50786",
      تاریخ: "27/6/1399",
      حمل: "17.2",
      میزان: "671",
      مالیات: "83.7",
      جمع: "775.9",
    },
    {
      ردیف: "24",
      صورتحساب: "50787",
      تاریخ: "30/6/1399",
      حمل: "87.5",
      میزان: "572",
      مالیات: "8.70",
      جمع: "615",
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
    {
      Account: "06FAAD9A-5114-08F6-D60C-961B2528B4F0",
      Name: "Amir Saunders",
      RegisterDate: "2014-08-13T09:17:49-07:00",
    },
    {
      Account: "EED7653D-7DD9-A722-64A8-36A55ECDBE77",
      Name: "Derek Thornton",
      RegisterDate: "2012-02-27T01:31:07-08:00",
    },
    {
      Account: "2A2E6D40-FEBD-C643-A751-9AB4CAF1E2F6",
      Name: "Fletcher Romero",
      RegisterDate: "2010-06-25T15:49:54-07:00",
    },
    {
      Account: "3978F8FA-DFF0-DA0E-0A5D-EB9D281A3286",
      Name: "Thaddeus Stein",
      RegisterDate: "2013-11-10T07:29:41-08:00",
    },
    {
      Account: "658DBF5A-176E-569A-9273-74FB5F69FA42",
      Name: "Nash Knapp",
      RegisterDate: "2005-06-24T09:11:19-07:00",
    },
    {
      Account: "76D2EE4B-7A73-1212-F6F2-957EF8C1F907",
      Name: "Quamar Vega",
      RegisterDate: "2011-04-13T20:06:29-07:00",
    },
    {
      Account: "00E46809-A595-CE82-C5B4-D1CAEB7E3E58",
      Name: "Philip Galloway",
      RegisterDate: "2008-08-21T18:59:38-07:00",
    },
    {
      Account: "C196781C-DDCC-AF83-DDC2-CA3E851A47A0",
      Name: "Mason French",
      RegisterDate: "2000-11-15T00:38:37-08:00",
    },
    {
      Account: "5911F201-818A-B393-5888-13157CE0D63F",
      Name: "Ross Cortez",
      RegisterDate: "2010-05-27T17:35:32-07:00",
    },
    {
      Account: "B8BB78F9-E1A1-A956-086F-E12B6FE168B6",
      Name: "Logan King",
      RegisterDate: "2003-07-08T16:58:06-07:00",
    },
    {
      Account: "06F636C3-9599-1A2D-5FD5-86B24ADDE626",
      Name: "Cedric Leblanc",
      RegisterDate: "2011-06-30T14:30:10-07:00",
    },
    {
      Account: "FE880CDD-F6E7-75CB-743C-64C6DE192412",
      Name: "Simon Sullivan",
      RegisterDate: "2013-06-11T16:35:07-07:00",
    },
    {
      Account: "BBEDD673-E2C1-4872-A5D3-C4EBD4BE0A12",
      Name: "Jamal West",
      RegisterDate: "2001-03-16T20:18:29-08:00",
    },
    {
      Account: "19BC22FA-C52E-0CC6-9552-10365C755FAC",
      Name: "Hector Morales",
      RegisterDate: "2012-11-01T01:56:34-07:00",
    },
    {
      Account: "A8292214-2C13-5989-3419-6B83DD637D6C",
      Name: "Herrod Hart",
      RegisterDate: "2008-03-13T19:21:04-07:00",
    },
    {
      Account: "0285564B-F447-0E7F-EAA1-7FB8F9C453C8",
      Name: "Clark Maxwell",
      RegisterDate: "2004-08-05T08:22:24-07:00",
    },
    {
      Account: "EA78F076-4F6E-4228-268C-1F51272498AE",
      Name: "Reuben Walter",
      RegisterDate: "2011-01-23T01:55:59-08:00",
    },
    {
      Account: "6A88C194-EA21-426F-4FE2-F2AE33F51793",
      Name: "Ira Ingram",
      RegisterDate: "2008-08-15T05:57:46-07:00",
    },
    {
      Account: "4275E873-439C-AD26-56B3-8715E336508E",
      Name: "Damian Morrow",
      RegisterDate: "2015-09-13T01:50:55-07:00",
    },
    {
      Account: "A0D733C4-9070-B8D6-4387-D44F0BA515BE",
      Name: "Macon Farrell",
      RegisterDate: "2011-03-14T05:41:40-07:00",
    },
    {
      Account: "B3683DE8-C2FA-7CA0-A8A6-8FA7E954F90A",
      Name: "Joel Galloway",
      RegisterDate: "2003-02-03T04:19:01-08:00",
    },
    {
      Account: "01D95A8E-91BC-2050-F5D0-4437AAFFD11F",
      Name: "Rigel Horton",
      RegisterDate: "2015-06-20T11:53:11-07:00",
    },
    {
      Account: "F0D12CC0-31AC-A82E-FD73-EEEFDBD21A36",
      Name: "Sylvester Gaines",
      RegisterDate: "2004-03-12T09:57:13-08:00",
    },
    {
      Account: "874FCC49-9A61-71BC-2F4E-2CE88348AD7B",
      Name: "Abbot Mckay",
      RegisterDate: "2008-12-26T20:42:57-08:00",
    },
    {
      Account: "B8DA1912-20A0-FB6E-0031-5F88FD63EF90",
      Name: "Solomon Green",
      RegisterDate: "2013-09-04T01:44:47-07:00",
    },
  ];
})();
