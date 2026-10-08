/* 公共脚本：导航、错误提示、JSON 加载封装、localStorage 工具
 * 依赖：jQuery 3、Bootstrap 5 (Toast)
 */
(function ($) {
  "use strict";

  // ===== 1. 顶部导航（每页通用，active 高亮当前页）=====
  window.renderNav = function (active) {
    var links = [
      { key: "home", href: "index.html", text: "首页" },
      { key: "canteens", href: "canteens.html", text: "食堂查询" },
      { key: "dishes", href: "dishes.html", text: "菜品管理" }
    ];
    var html = '<nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom">'
      + '<div class="container">'
      + '<a class="navbar-brand" href="index.html">🍴 校园食堂信息中心</a>'
      + '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">'
      + '<span class="navbar-toggler-icon"></span></button>'
      + '<div class="collapse navbar-collapse" id="mainNav"><ul class="navbar-nav ms-auto">';
    links.forEach(function (l) {
      var cls = l.key === active ? "nav-link active fw-bold" : "nav-link";
      html += '<li class="nav-item"><a class="' + cls + '" href="' + l.href + '">' + l.text + "</a></li>";
    });
    html += "</ul></div></div></nav>";
    $("#nav-placeholder").html(html);
  };

  // ===== 2. 错误提示 Toast =====
  window.showError = function (msg, type) {
    type = type || "danger";
    var bg = "text-bg-" + type;
    var icon = type === "danger" ? "⚠️" : "✅";
    $("#toast-container").html(
      '<div class="toast show align-items-center ' + bg + ' border-0" role="alert">'
        + '<div class="d-flex">'
        + '<div class="toast-body">' + icon + " " + msg + "</div>"
        + '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>'
        + "</div></div>"
    );
    // 3.5 秒后自动消失
    setTimeout(function () { $("#toast-container .toast").toast("hide"); }, 3500);
  };

  // ===== 3. 统一 JSON 加载（带错误回调）=====
  window.loadJSON = function (url, onSuccess, onAlways) {
    $.getJSON(url)
      .done(function (data) { onSuccess(data); })
      .fail(function (jqxhr, textStatus, error) {
        console.error("数据加载失败:", url, error);
        showError("数据加载失败：" + url + "（" + error + "）");
      })
      .always(function () { if (onAlways) onAlways(); });
  };

  // ===== 4. localStorage 工具：菜品增删改持久化 =====
  var STORAGE_KEY = "canteen_dishes_v1";

  window.LocalDB = {
    // 从 localStorage 读取，若为空则用初始数据 seed 初始化
    load: function (seed) {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) {
        console.warn("localStorage 读取失败，将使用初始数据:", e);
      }
      if (seed) LocalDB.save(seed);
      return seed || [];
    },
    save: function (list) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (e) {
        console.error("localStorage 写入失败:", e);
        showError("本地存储写入失败，更改不会保留");
      }
    },
    clear: function () { localStorage.removeItem(STORAGE_KEY); }
  };
})(jQuery);
