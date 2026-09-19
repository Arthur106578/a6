// stats.js —— fetch 加载 data.json，ECharts 渲染各宿舍用电量柱状图
// file:// 直接打开时 fetch 被拦截，使用内嵌回退数据保证页面可用
const FALLBACK = {
  title: '各宿舍本月用电量',
  dorms: ['1栋101', '1栋203', '2栋305', '2栋412', '3栋108', '3栋520'],
  kwh: [86, 102, 145, 78, 64, 95]
};

const statusEl = document.querySelector('#status');
const chart = echarts.init(document.querySelector('#bar-chart'));

const renderChart = (data) => {
  document.querySelector('#sub-title').textContent = data.title + ' · 数据来源：data.json · 单位：度(kWh)';
  chart.setOption({
    title: { text: data.title, left: 'center' },
    tooltip: { trigger: 'axis', formatter: '{b}<br/>用电：{c} 度' },
    xAxis: { type: 'category', data: data.dorms, axisLabel: { interval: 0 } },
    yAxis: { type: 'value', name: '度' },
    series: [{
      name: '用电量',
      type: 'bar',
      data: data.kwh,
      itemStyle: { color: '#198754' },
      label: { show: true, position: 'top' }
    }]
  });
};

const loadData = async () => {
  statusEl.textContent = '加载中…';
  statusEl.style.display = 'block';
  try {
    const res = await fetch('data.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    if (!data.dorms || data.dorms.length === 0) {
      statusEl.textContent = '暂无数据';
      return;
    }
    statusEl.style.display = 'none';
    renderChart(data);
  } catch (err) {
    // file:// 打开：回退内嵌数据；服务器访问且失败：显示错误提示
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
