# 校园食堂信息中心

> 课程作业：校园公共信息与数据展示中心
> 主题：校园食堂信息（响应式前端应用）

## 一、项目简介

围绕"校园食堂"主题开发的响应式前端应用，提供食堂查询、菜品管理、数据可视化与三维导览功能。所有数据来源于本地 JSON 文件，菜品增删改通过浏览器 localStorage 持久化，无需后端服务器。

## 二、技术栈

| 类别 | 选型 | 说明 |
|---|---|---|
| 响应式 UI 框架 | Bootstrap 5 (CDN) | 栅格、组件、移动适配 |
| DOM 操作 / 事件 | jQuery 3 (CDN) | 数据加载、筛选、增删改 |
| 图表库 | ECharts 5 (CDN) | 柱状图 + 饼图（两类） |
| 三维展示 | A-Frame 1.5 (CDN) | 食堂三维漫游场景 |
| 数据格式 | 本地 JSON | canteens.json / dishes.json |
| 持久化 | localStorage | 菜品增删改本地保存 |

## 三、文件结构

```
canteen/
├── index.html              # 首页：概览 + 快捷入口 + A-Frame 三维导览
├── canteens.html           # 功能页1：食堂筛选/搜索/排序
├── dishes.html             # 功能页2：菜品增删改 + ECharts 图表
├── css/
│   └── style.css           # 响应式自定义样式
├── js/
│   ├── common.js           # 公共：导航、错误提示、loadJSON、LocalDB
│   ├── canteens.js         # 食堂查询页逻辑
│   └── dishes.js           # 菜品管理 + 图表逻辑
├── data/
│   ├── canteens.json       # 食堂数据（4 条）
│   └── dishes.json         # 菜品数据（9 条）
└── README.md               # 运行说明
```

## 四、运行方式

> 浏览器 `file://` 协议会被 CORS 阻止加载本地 JSON，必须使用本地 HTTP 服务器。

### 方法 1：Python 自带服务器（推荐）

```bash
# 进入项目根目录
cd canteen

# Python 3
python -m http.server 8000
```

浏览器访问：<http://localhost:8000/index.html>

### 方法 2：Node.js

```bash
npx serve .
# 或 npx http-server -p 8000
```

### 方法 3：VS Code Live Server 插件

右键 `index.html` → Open with Live Server。

## 五、功能与作业要求对照

| 作业要求 | 实现位置 |
|---|---|
| 信息首页 | [index.html](index.html) |
| 至少 2 个功能页面 | [canteens.html](canteens.html)、[dishes.html](dishes.html) |
| 响应式适配手机和桌面 | Bootstrap 栅格 + 媒体查询（`style.css`） |
| 交互查询模块（筛选/搜索） | canteens.html：区域筛选 + 关键词搜索 + 评分排序 |
| 交互管理模块（添加/修改） | dishes.html：模态框新增、编辑、删除 |
| 基于 JSON 的数据加载 | `data/canteens.json`、`data/dishes.json`，jQuery `$.getJSON` |
| 至少两类图表 | ECharts 柱状图（各食堂均价）+ 饼图（类别占比），见 dishes.html |
| 三维展示区域 | A-Frame 食堂三维导览，见 index.html |
| 完整错误提示 | `common.js` 的 `showError()` Toast，覆盖加载失败/校验失败/重置等 |
| 运行说明 | 本文件 README.md |
| jQuery / Bootstrap 必选其一 | 同时使用 jQuery 3 + Bootstrap 5 |
| Three.js / A-Frame 必选其一 | 使用 A-Frame 1.5 |

## 六、功能说明

### 6.1 首页（index.html）
- Hero 横幅 + 4 张数据概览卡片（食堂数、菜品数、均价、平均评分）
- 3 个快捷入口卡片
- A-Frame 三维食堂导览：地面、四围墙体、取餐台、3 排餐桌椅、入口标识；WASD 漫游、鼠标拖拽视角
- 加载超时显示占位提示

### 6.2 食堂查询页（canteens.html）
- 关键词搜索（食堂名称 + 标签）
- 区域筛选（东区 / 西区 / 全部）
- 评分升降排序
- 卡片网格，星级 + 标签 pill 展示
- 空结果友好提示

### 6.3 菜品管理页（dishes.html）
- 菜品表格（编号 / 名称 / 食堂 / 类别 / 价格 / 热量 / 评分 / 操作）
- 新增按钮 → 模态框录入
- 编辑按钮 → 模态框预填修改
- 删除按钮 → 确认后删除
- 重置按钮 → 恢复初始 JSON 数据
- 按食堂筛选下拉
- ECharts 柱状图：各食堂菜品均价
- ECharts 饼图：菜品类别占比

## 七、数据结构

### data/canteens.json
```json
[
  { "id": 1, "name": "第一食堂", "area": "东区", "floors": 3,
    "openHours": "06:30-21:00", "rating": 4.5, "tags": ["快餐", "面食", "小吃"] }
]
```

### data/dishes.json
```json
[
  { "id": 101, "canteenId": 1, "name": "红烧肉盖饭", "price": 15,
    "category": "主食", "calories": 680, "rating": 4.7 }
]
```

## 八、错误提示

| 场景 | 处理 |
|---|---|
| JSON 加载失败 | `common.js` `loadJSON` 失败回调 → 顶部 Toast 红色提示，控制台日志 |
| A-Frame 加载超时 | 首页 8 秒未 `loaded` 事件 → 显示占位文本 + Toast 提示 |
| 表单校验失败 | 名称空 / 价格非法 / 评分越界 → Toast 提示，不提交 |
| localStorage 写入失败 | `LocalDB.save` 捕获异常 → Toast 提示更改不保留 |

## 九、注意事项

- 需要联网加载 CDN 资源（Bootstrap、jQuery、A-Frame、ECharts）。
- 菜品改动只保存到当前浏览器（localStorage），换浏览器或清缓存后会丢失。
- 三维场景在低性能设备上可能加载较慢，已设置 8 秒超时占位提示。
