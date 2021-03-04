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
      { name: "عنوان ارز", type: "text", width: 100 },
      { name: "دلار آمریکا", type: "text", width: 100 },
      { name: "کد", type: "text", width: 100 },
      { name: "قیمت ارز", type: "text", width: 100 },
      { type: "control" },
    ],
  });
})(jQuery);
