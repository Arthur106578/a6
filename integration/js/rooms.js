// rooms.js —— 自习室数据写死在数组，按楼层/开放状态筛选
const rooms = [
  { name: '101 静音自习室', floor: 1, seats: 80, open: true },
  { name: '102 研讨自习室', floor: 1, seats: 40, open: false },
  { name: '201 考研专区',   floor: 2, seats: 120, open: true },
  { name: '203 电子阅览室', floor: 2, seats: 60, open: true },
  { name: '301 通宵自习室', floor: 3, seats: 50, open: false },
  { name: '305 阳光阅读区', floor: 3, seats: 36, open: true }
];

const floorSel = document.querySelector('#floor');
const statusSel = document.querySelector('#status');
const listEl = document.querySelector('#room-list');

// 统一渲染：先筛选数组，再重建列表
const render = () => {
  const floor = floorSel.value;
  const status = statusSel.value;

  const shown = rooms.filter(r => {
    const floorOk = floor === 'all' || r.floor === Number(floor);
    const statusOk = status === 'all' ||
      (status === 'open' ? r.open : !r.open);
    return floorOk && statusOk;
  });

  listEl.innerHTML = '';
  if (shown.length === 0) {
    listEl.innerHTML = '<li class="list-group-item text-muted">没有符合条件的自习室</li>';
    return;
  }

  shown.forEach(r => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    const badge = r.open
      ? '<span class="badge bg-success">开放中</span>'
      : '<span class="badge bg-secondary">已关闭</span>';
    li.innerHTML = `<span>${r.name} · ${r.floor}楼 · ${r.seats}座</span> ${badge}`;
    listEl.appendChild(li);
  });
};

floorSel.addEventListener('change', render);
statusSel.addEventListener('change', render);
document.querySelector('#reset').addEventListener('click', () => {
  floorSel.value = 'all';
  statusSel.value = 'all';
  render();
});

render();
