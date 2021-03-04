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
      { name: "نام", type: "text" },
      { name: "شناسه انتقال", type: "number" },
      { name: "تاریخ", type: "text" },
      { name: "جمع", type: "text" },
      { type: "control" },
    ],
  });
})(jQuery);
