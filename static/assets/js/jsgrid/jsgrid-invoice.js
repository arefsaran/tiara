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
    deleteConfirm: "Do you really want to delete the client?",
    controller: db,
    fields: [
      { name: "ردیف", type: "number", width: 50 },
      { name: "صورتحساب", type: "number" },
      { name: "تاریخ", type: "text" },
      { name: "حمل", type: "number" },
      { name: "میزان", type: "number" },
      { name: "مالیات", type: "number" },
      { name: "جمع", type: "number" },
      { type: "control", width: 100 },
    ],
  });
})(jQuery);
