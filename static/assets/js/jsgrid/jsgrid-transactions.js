(function ($) {
  "use strict";
  $("#batchDelete").jsGrid({
    width: "100%",
    autoload: true,
    confirmDeleting: false,
    paging: true,
    controller: {
      loadData: function () {
        return db.clients;
      },
    },
    fields: [
      { name: "شماره سفارش", type: "text", width: 50 },
      { name: "شناسه تراکنش", type: "number", width: 100 },
      { name: "تاریخ", type: "text", width: 100 },
      { name: "روش پرداخت", type: "text", width: 50 },
      { name: "وضعیت تحویل", type: "text", width: 100 },
      { name: "مبلغ", type: "text", width: 100 },
    ],
  });
})(jQuery);
