(function ($) {
  "use strict";
  $("#basicScenario").jsGrid({
    width: "100%",
    filtering: true,
    editing: true,
    inserting: true,
    sorting: true,
    paging: true,
    autoload: true,
    pActionSize: 15,
    pActionButtonCount: 5,
    deleteConfirm: "آیا مطمئن به حذف هستید؟",
    controller: db,
    fields: [
      { name: "کلید کاربر", type: "text", width: 100 },
      { name: "روسی", type: "text", width: 100 },
      { name: "عربی", type: "text", width: 100 },
      { name: "انگلیسی", type: "text", width: 100 },
      { type: "control" },
    ],
  });
})(jQuery);
