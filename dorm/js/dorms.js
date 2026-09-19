// dorms.js —— 宿舍数据写死在数组，按楼栋/床位状态筛选
const dorms = [
  { name: '1栋101', building: 1, beds: 4, free: 1 },
  { name: '1栋203', building: 1, beds: 4, free: 0 },
  { name: '2栋305', building: 2, beds: 6, free: 2 },
  { name: '2栋412', building: 2, beds: 6, free: 0 },
  { name: '3栋108', building: 3, beds: 4, free: 3 },
  { name: '3栋520', building: 3, beds: 4, free: 1 }
];

const buildingSel = document.querySelector('#building');
const statusSel = document.querySelector('#status');
const listEl = document.querySelector('#dorm-list');

// 统一渲染：先筛选数组，再重建列表
const render = () => {
  const building = buildingSel.value;
  const status = statusSel.value;

  const shown = dorms.filter(d => {
    const buildingOk = building === 'all' || d.building === Number(building);
    const statusOk = status === 'all' ||
      (status === 'free' ? d.free > 0 : d.free === 0);
    return buildingOk && statusOk;
  });

  listEl.innerHTML = '';
  if (shown.length === 0) {
    listEl.innerHTML = '<li class="list-group-item text-muted">没有符合条件的宿舍</li>';
    return;
  }

  shown.forEach(d => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    const badge = d.free > 0
      ? `<span class="badge bg-success">有空床 ${d.free}/${d.beds}</span>`
      : `<span class="badge bg-secondary">已满 ${d.beds}/${d.beds}</span>`;
    li.innerHTML = `<span>${d.name} · ${d.beds} 人间</span> ${badge}`;
    listEl.appendChild(li);
  });
};

buildingSel.addEventListener('change', render);
statusSel.addEventListener('change', render);
document.querySelector('#reset').addEventListener('click', () => {
  buildingSel.value = 'all';
  statusSel.value = 'all';
  render();
});

render();
