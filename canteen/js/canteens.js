/* 食堂查询页：筛选、搜索、排序
 * 依赖：jQuery、common.js (loadJSON, showError, renderNav)
 */
(function ($) {
  "use strict";

  var allCanteens = [];

  $(function () {
    renderNav("canteens");

    loadJSON("data/canteens.json", function (data) {
      allCanteens = data;
      render(data);
    });

    // 事件绑定
    $("#search").on("input", filter);
    $("#area-filter").on("change", filter);
    $("#sort-filter").on("change", filter);
    $("#reset").on("click", function () {
      $("#search").val("");
      $("#area-filter").val("");
      $("#sort-filter").val("default");
      filter();
      showError("已重置筛选条件", "success");
    });
  });

  function filter() {
    var kw = $("#search").val().trim().toLowerCase();
    var area = $("#area-filter").val();
    var sort = $("#sort-filter").val();

    var list = allCanteens.filter(function (c) {
      var inName = c.name.toLowerCase().indexOf(kw) !== -1;
      var inTags = c.tags.join(",").toLowerCase().indexOf(kw) !== -1;
      var matchKw = !kw || inName || inTags;
      var matchArea = !area || c.area === area;
      return matchKw && matchArea;
    });

    if (sort === "rating-desc") {
      list.sort(function (a, b) { return b.rating - a.rating; });
    } else if (sort === "rating-asc") {
      list.sort(function (a, b) { return a.rating - b.rating; });
    }

    render(list);
  }

  function render(list) {
    if (!list.length) {
      $("#canteen-list").empty();
      $("#empty-tip").show();
      return;
    }
    $("#empty-tip").hide();

    var html = list.map(function (c) {
      var stars = "★★★★★".slice(0, Math.round(c.rating)) + "☆☆☆☆☆".slice(0, 5 - Math.round(c.rating));
      var tags = c.tags.map(function (t) {
        return '<span class="tag-pill">' + t + "</span>";
      }).join("");
      return (
        '<div class="col-md-6 col-lg-4">' +
        '<div class="card canteen-card p-3 h-100">' +
        '<div class="d-flex justify-content-between align-items-start">' +
        '<h5 class="mb-1">' + c.name + "</h5>" +
        '<span class="rating-stars" title="' + c.rating + '分">' + stars + "</span>" +
        "</div>" +
        '<p class="text-muted mb-2"><small>' + c.area + " · " + c.floors + "层 · " + c.openHours + "</small></p>" +
        '<div class="mb-2">' + tags + "</div>" +
        '<div class="mt-auto"><span class="badge bg-light text-dark">编号 ' + c.id + "</span></div>" +
        "</div></div>"
      );
    }).join("");

    $("#canteen-list").html(html);
  }
})(jQuery);
