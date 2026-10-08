/* 菜品管理页：增删改 + ECharts 图表
 * 依赖：jQuery、Bootstrap、ECharts、common.js (loadJSON, showError, renderNav, LocalDB)
 */
(function ($) {
  "use strict";

  var canteens = [];
  var dishes = [];
  var barChart = null;
  var pieChart = null;
  var modal = null;

  $(function () {
    renderNav("dishes");
    modal = new bootstrap.Modal($("#dish-modal")[0]);

    // 加载食堂下拉数据
    loadJSON("data/canteens.json", function (data) {
      canteens = data;
      // 填充筛选与模态框下拉
      var opts = data.map(function (c) {
        return '<option value="' + c.id + '">' + c.name + "</option>";
      }).join("");
      $("#canteen-filter").append(opts);
      $("#dish-canteen").append(opts);
    });

    // 加载菜品初始数据 → 初始化 localStorage
    loadJSON("data/dishes.json", function (data) {
      dishes = LocalDB.load(data); // 若 localStorage 为空则用 data 初始化
      renderTable();
      renderCharts();
    });

    // 事件绑定
    $("#btn-add").on("click", openAdd);
    $("#btn-reset").on("click", resetData);
    $("#btn-save").on("click", saveDish);
    $("#canteen-filter").on("change", renderTable);
    // 窗口尺寸变化时图表重绘
    $(window).on("resize", function () {
      if (barChart) barChart.resize();
      if (pieChart) pieChart.resize();
    });
  });

  // ====== 表格渲染 ======
  function renderTable() {
    var filterId = parseInt($("#canteen-filter").val(), 10);
    var list = dishes;
    if (filterId) {
      list = dishes.filter(function (d) { return d.canteenId === filterId; });
    }

    if (!list.length) {
      $("#dish-tbody").html('<tr><td colspan="8" class="text-center text-muted py-4">尚无菜品数据</td></tr>');
      return;
    }

    var canteenName = function (id) {
      var c = canteens.find(function (x) { return x.id === id; });
      return c ? c.name : "未知";
    };

    var html = list.map(function (d) {
      return (
        "<tr>" +
        "<td>" + d.id + "</td>" +
        "<td>" + escapeHtml(d.name) + "</td>" +
        "<td>" + canteenName(d.canteenId) + "</td>" +
        "<td>" + d.category + "</td>" +
        "<td>" + d.price.toFixed(1) + "</td>" +
        "<td>" + (d.calories || "-") + "</td>" +
        "<td>" + (d.rating || "-") + "</td>" +
        '<td class="text-nowrap">' +
        '<button class="btn btn-sm btn-outline-primary me-1 btn-edit" data-id="' + d.id + '">编辑</button>' +
        '<button class="btn btn-sm btn-outline-danger btn-del" data-id="' + d.id + '">删除</button>' +
        "</td>" +
        "</tr>"
      );
    }).join("");

    $("#dish-tbody").html(html);
    $(".btn-edit").on("click", function () { openEdit(parseInt($(this).attr("data-id"), 10)); });
    $(".btn-del").on("click", function () { delDish(parseInt($(this).attr("data-id"), 10)); });
  }

  // ====== 新增 ======
  function openAdd() {
    $("#modal-title").text("新增菜品");
    $("#dish-form")[0].reset();
    $("#dish-id").val("");
    $("#dish-canteen").val(canteens.length ? canteens[0].id : "");
    modal.show();
  }

  // ====== 编辑 ======
  function openEdit(id) {
    var d = dishes.find(function (x) { return x.id === id; });
    if (!d) { showError("找不到菜品 id=" + id); return; }
    $("#modal-title").text("编辑菜品");
    $("#dish-id").val(d.id);
    $("#dish-name").val(d.name);
    $("#dish-canteen").val(d.canteenId);
    $("#dish-category").val(d.category);
    $("#dish-price").val(d.price);
    $("#dish-calories").val(d.calories || "");
    $("#dish-rating").val(d.rating || "");
    modal.show();
  }

  // ====== 保存（新增/修改）======
  function saveDish() {
    var name = $("#dish-name").val().trim();
    var canteenId = parseInt($("#dish-canteen").val(), 10);
    var category = $("#dish-category").val();
    var price = parseFloat($("#dish-price").val());
    var calories = parseInt($("#dish-calories").val(), 10) || 0;
    var rating = parseFloat($("#dish-rating").val()) || 0;

    // 校验
    if (!name) { showError("请填写菜品名称"); return; }
    if (isNaN(price) || price < 0) { showError("价格必须为非负数字"); return; }
    if (rating < 0 || rating > 5) { showError("评分需在 0-5 之间"); return; }

    var id = $("#dish-id").val();
    if (id) {
      // 修改
      var idx = dishes.findIndex(function (x) { return x.id === parseInt(id, 10); });
      if (idx === -1) { showError("找不到要修改的菜品"); return; }
      dishes[idx] = $.extend(dishes[idx], {
        name: name, canteenId: canteenId, category: category,
        price: price, calories: calories, rating: rating
      });
      showError("修改成功", "success");
    } else {
      // 新增
      var newId = dishes.reduce(function (m, x) { return Math.max(m, x.id); }, 0) + 1;
      dishes.push({
        id: newId, name: name, canteenId: canteenId, category: category,
        price: price, calories: calories, rating: rating
      });
      showError("新增成功，编号 " + newId, "success");
    }
    LocalDB.save(dishes);
    modal.hide();
    renderTable();
    renderCharts();
  }

  // ====== 删除 ======
  function delDish(id) {
    if (!confirm("确定删除编号 " + id + " 的菜品？")) return;
    var idx = dishes.findIndex(function (x) { return x.id === id; });
    if (idx === -1) { showError("找不到要删除的菜品"); return; }
    dishes.splice(idx, 1);
    LocalDB.save(dishes);
    renderTable();
    renderCharts();
    showError("已删除编号 " + id, "success");
  }

  // ====== 重置数据 ======
  function resetData() {
    if (!confirm("将清除所有修改，恢复到初始数据。继续？")) return;
    LocalDB.clear();
    loadJSON("data/dishes.json", function (data) {
      dishes = LocalDB.load(data);
      renderTable();
      renderCharts();
      showError("已恢复初始数据", "success");
    });
  }

  // ====== ECharts 两类图表 ======
  function renderCharts() {
    // 柱状图：各食堂菜品均价
    if (!barChart) barChart = echarts.init(document.getElementById("bar-chart"));
    var canteenNames = canteens.map(function (c) { return c.name; });
    var avgPrices = canteens.map(function (c) {
      var items = dishes.filter(function (d) { return d.canteenId === c.id; });
      if (!items.length) return 0;
      var sum = items.reduce(function (s, d) { return s + d.price; }, 0);
      return +(sum / items.length).toFixed(2);
    });
    barChart.setOption({
      tooltip: { trigger: "axis" },
      grid: { left: 40, right: 20, top: 30, bottom: 30 },
      xAxis: { type: "category", data: canteenNames },
      yAxis: { type: "value", name: "元" },
      series: [{
        name: "菜品均价",
        type: "bar",
        data: avgPrices,
        itemStyle: { color: "#ff6b35" }
      }]
    });

    // 饼图：菜品类别占比
    if (!pieChart) pieChart = echarts.init(document.getElementById("pie-chart"));
    var categories = {};
    dishes.forEach(function (d) {
      categories[d.category] = (categories[d.category] || 0) + 1;
    });
    var pieData = Object.keys(categories).map(function (k) {
      return { name: k, value: categories[k] };
    });
    pieChart.setOption({
      tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
      legend: { bottom: 0 },
      series: [{
        name: "类别占比",
        type: "pie",
        radius: ["40%", "65%"],
        data: pieData,
        itemStyle: { borderRadius: 6, borderColor: "#fff", borderWidth: 2 }
      }]
    });
  }

  // ====== 工具：HTML 转义 ======
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})(jQuery);
