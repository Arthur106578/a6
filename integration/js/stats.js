// stats.js —— fetch 加载 data.json，ECharts 渲染各自习室使用量柱状图
// file:// 直接打开时 fetch 被拦截，使用内嵌回退数据保证页面可用
const FALLBACK = {
  title: '各自习室本周使用量',
  rooms: ['101静音', '102研讨', '201考研', '203电子', '301通宵', '305阳光'],
  counts: [320, 96, 512, 288, 145, 203]
};

const chart = echarts.init(document.querySelector('#bar-chart'));

const renderChart = (data) => {
  document.querySelector('#sub-title').textContent = data.title + ' · 数据来源：data.json · 单位：人次';
  chart.setOption({
    title: { text: data.title, left: 'center' },
    tooltip: { trigger: 'axis', formatter: '{b}<br/>使用量：{c} 人次' },
    xAxis: { type: 'category', data: data.rooms, axisLabel: { interval: 0 } },
    yAxis: { type: 'value', name: '人次' },
    series: [{
      name: '使用量',
      type: 'bar',
      data: data.counts,
      itemStyle: { color: '#0d6efd' },
      label: { show: true, position: 'top' }
    }]
  });
};

const statusEl = document.querySelector('#status');

const loadData = async () => {
  statusEl.textContent = '加载中…';
  statusEl.style.display = 'block';
  try {
    const res = await fetch('data.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    if (!data.rooms || data.rooms.length === 0) {
      statusEl.textContent = '暂无数据';
      return;
    }
    statusEl.style.display = 'none';
    renderChart(data);
  } catch (err) {
    // 直接双击打开(file://)时 fetch 被浏览器拦截：回退到内嵌数据
    // 通过本地服务器访问且加载失败时：显示错误提示，便于演示“断网/失败”状态
    if (location.protocol === 'file:') {
      statusEl.style.display = 'none';
      renderChart(FALLBACK);
    } else {
      statusEl.textContent = '加载失败：' + err.message + '（请检查 data.json 是否存在或网络是否正常）';
      statusEl.style.display = 'block';
    }
  }
};

window.addEventListener('resize', () => chart.resize());
loadData();
