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
      {
        headerTemplate: function () {
          return $("<button>")
            .attr("type", "button")
            .text("حذف")
            .addClass("btn btn-danger btn-sm btn-delete mb-0 b-r-4")
            .click(function () {
              deleteSelectedItems();
            });
        },
        itemTemplate: function (_, item) {
          return $("<input>")
            .attr("type", "checkbox")
            .prop("checked", $.inArray(item, selectedItems) > -1)
            .on("change", function () {
              $(this).is(":checked") ? selectItem(item) : unselectItem(item);
            });
        },
        align: "center",
        width: 100,
      },
      { name: "عنوان", type: "text", width: 150 },
      { name: "کد", type: "number", width: 100 },
      { name: "تخفیف", type: "number", width: 100 },
      { name: "وضعیت", type: "text", width: 100 },
    ],
  });
  var selectedItems = [];
  var selectItem = function (item) {
    selectedItems.push(item);
  };
  var unselectItem = function (item) {
    selectedItems = $.grep(selectedItems, function (i) {
      return i !== item;
    });
  };
  var deleteSelectedItems = function () {
    if (!selectedItems.length || !confirm("آیا مظمئن به حذف هستید؟")) return;
    deleteClientsFromDb(selectedItems);
    var $grid = $("#batchDelete");
    $grid.jsGrid("option", "pActionIndex", 1);
    $grid.jsGrid("loadData");
    selectedItems = [];
  };
  var deleteClientsFromDb = function (deletingClients) {
    db.clients = $.map(db.clients, function (client) {
      return $.inArray(client, deletingClients) > -1 ? null : client;
    });
  };
})(jQuery);
