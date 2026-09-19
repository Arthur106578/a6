# 宿舍信息中心

期末个人技术整合练习原型。围绕"宿舍"主题整合页面、样式、交互、数据可视化四个模块：统一入口导航，宿舍名单在"查询"与"统计"两个模块中保持一致（同一批宿舍），不是孤立页面。

## 模块说明

| 页面 | 对应模块 | 技术 |
|---|---|---|
| `index.html` | 页面 | Bootstrap 5 导航栏 + 卡片入口，响应式栅格 |
| `css/style.css` | 样式 | 外部自定义 CSS（配色、hero 区、卡片 hover） |
| `dorms.html` + `js/dorms.js` | 交互 | 数组+对象组织宿舍数据，按楼栋/床位状态组合筛选，先 filter 数组再 render 列表 |
| `stats.html` + `js/stats.js` + `data.json` | 数据/可视化 | fetch 加载本地 JSON，ECharts 柱状图展示各宿舍本月用电量；含加载中/失败/空数据三态 |

## 运行说明

**方式一（推荐，看到真实 fetch）**：用 VS Code Live Server 打开 `dorm/` 目录，或：

```bash
cd dorm
python -m http.server 8000
```

浏览器访问 http://localhost:8000/index.html

**方式二**：直接双击 `index.html` 也可使用；统计页在 `file://` 下 fetch 被浏览器拦截，会自动使用 `js/stats.js` 内嵌的回退数据（内容与 data.json 一致）。

## 资源来源说明

- Bootstrap 5.3.3（CSS + JS Bundle）：jsDelivr CDN `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/`
- ECharts 5.5.1：jsDelivr CDN `https://cdn.jsdelivr.net/npm/echarts@5.5.1/`
- 宿舍数据与用电量数据：本人编写的模拟数据（`js/dorms.js` 数组、`data.json`）
- 页面未使用任何图片素材

## 质量自查记录

| 自查项 | 结果 |
|---|---|
| 三档宽度（手机 375 / 平板 768 / 桌面 1280） | 导航折叠正常，卡片 1→2 列，图表自适应，无横向滚动 |
| 断网/加载失败 | 服务器方式下删除或改名 data.json，统计页显示黄色"加载失败：HTTP 404…" |
| 空数据 | data.json 中 dorms 改为 []，显示"暂无数据" |
| Console | 三个页面 F12 Console 均无红色报错 |

## 同伴审查记录

| 审查人 | 意见 | 处理（采纳/拒绝/修改） |
|---|---|---|
| （待填写） | | |

## 轮值协调记录

| 议题 | 参与人 | 分歧 | 结论 |
|---|---|---|---|
| （待填写） | | | |
