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
      "کلید کاربر": "لیست کاربران",
      روسی: "список пользователей",
      عربی: ".قوائم المستخدمين",
      انگلیسی: "user lists",
    },
    {
      "کلید کاربر": "نام کاربران",
      روسی: "имя пользователя",
      عربی: "اسم المستخدم الأول",
      انگلیسی: "user first name",
    },
    {
      "کلید کاربر": "نام خانوادگی",
      روسی: "фамилия пользователя",
      عربی: "اسم المستخدم الأخير",
      انگلیسی: "user last name",
    },
    {
      "کلید کاربر": "ورود",
      روسی: "логин пользователя",
      عربی: "دخول المستخدم",
      انگلیسی: "user login",
    },
    {
      "کلید کاربر": "محصول",
      روسی: "добавить продукт",
      عربی: "أضف المنتج",
      انگلیسی: "add product",
    },
    {
      "کلید کاربر": "سفارش",
      روسی: "упорядоченный список",
      عربی: "قائمة الأوامر",
      انگلیسی: "orders list",
    },
    {
      "کلید کاربر": "تخفیف",
      روسی: "список купонов",
      عربی: "قائمة القسائم",
      انگلیسی: "coupon list",
    },
    {
      "کلید کاربر": "پسورد جدید",
      روسی: "пользователя новый пароль",
      عربی: ".مستخدم جديد كلمة مرور",
      انگلیسی: "user new password",
    },
    {
      "کلید کاربر": "فراموشی پسورد",
      روسی: "сброс пароля",
      عربی: "أعد ضبط كلمة السر",
      انگلیسی: "user reset password",
    },
    {
      "کلید کاربر": "ایمیل",
      روسی: "идентификатор электронной почты",
      عربی: "هوية البريد الإلكتروني",
      انگلیسی: "email id",
    },
    {
      "کلید کاربر": "نقش",
      روسی: "роль пользователя",
      عربی: "أدوار المستخدم",
      انگلیسی: "user roles",
    },
    {
      "کلید کاربر": "اطلاعات",
      روسی: "информация профиля",
      عربی: "معلومات التوصيف",
      انگلیسی: "profile information",
    },
    {
      "کلید کاربر": "حذف",
      روسی: "удалить",
      عربی: "احذف",
      انگلیسی: "delete",
    },
    {
      "کلید کاربر": "درج",
      روسی: "спасать",
      عربی: "احفظ",
      انگلیسی: "save",
    },
    {
      "کلید کاربر": "ویرایش",
      روسی: "редактировать",
      عربی: "حرر",
      انگلیسی: "edit",
    },
    {
      "کلید کاربر": "عمومی",
      روسی: "главные вкладки",
      عربی: "الألسنة العامة",
      انگلیسی: "general tabs",
    },
    {
      "کلید کاربر": "فیزیکی",
      روسی: "физический",
      عربی: "جسدي",
      انگلیسی: "physical",
    },
    {
      "کلید کاربر": "دیجیتال",
      روسی: "цифровой",
      عربی: "رقمي",
      انگلیسی: "digital",
    },
    {
      "کلید کاربر": "زیرمجموعه",
      روسی: "промежуточная категория",
      عربی: "الفئة الفرعيةر",
      انگلیسی: "sub category",
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
