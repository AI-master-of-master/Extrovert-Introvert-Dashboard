// グローバル変数
let allData = [];
let currentPage = 1;
const itemsPerPage = 10;

// 色の設定
const colors = {
  extrovert: {
    primary: 'rgba(54, 162, 235, 0.7)',
    border: 'rgba(54, 162, 235, 1)',
    light: 'rgba(54, 162, 235, 0.3)'
  },
  introvert: {
    primary: 'rgba(255, 99, 132, 0.7)',
    border: 'rgba(255, 99, 132, 1)',
    light: 'rgba(255, 99, 132, 0.3)'
  }
};

// グラフの共通設定
const chartDefaults = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 1.5
};

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // データの読み込み
    await loadStats();
    await loadData();
    
    // イベントリスナーの設定
    document.getElementById('prev-page').addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable(allData);
      }
    });
    
    document.getElementById('next-page').addEventListener('click', () => {
      const maxPage = Math.ceil(allData.length / itemsPerPage);
      if (currentPage < maxPage) {
        currentPage++;
        renderTable(allData);
      }
    });
    
    document.getElementById('data-search').addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filteredData = allData.filter(item => {
        return Object.values(item).some(val => 
          val.toString().toLowerCase().includes(searchTerm)
        );
      });
      currentPage = 1;
      renderTable(filteredData);
    });
  } catch (error) {
    console.error('ダッシュボードの初期化中にエラーが発生しました:', error);
    document.body.innerHTML = `<div class="alert alert-danger m-5">データの読み込み中にエラーが発生しました。<br>${error.message}</div>`;
  }
});

// 統計データを読み込む
async function loadStats() {
  const response = await fetch('/api/stats');
  if (!response.ok) {
    throw new Error(`APIエラー: ${response.status}`);
  }
  const stats = await response.json();
  
  // サマリーデータの表示
  renderSummary(stats);
  
  // グラフの描画
  renderDistributionChart(stats);
  renderAverageComparisonChart(stats);
  renderSocialRadarChart(stats);
  renderStageFearChart(stats);
  renderDrainedChart(stats);
}

// 全データを読み込む
async function loadData() {
  const response = await fetch('/api/data');
  if (!response.ok) {
    throw new Error(`APIエラー: ${response.status}`);
  }
  allData = await response.json();
  renderTable(allData);
}

// サマリーデータの表示
function renderSummary(stats) {
  const summaryElement = document.getElementById('summary-data');
  
  const extrovertPercent = Math.round((stats.counts.extroverts / stats.counts.total) * 100);
  const introvertPercent = Math.round((stats.counts.introverts / stats.counts.total) * 100);
  
  summaryElement.innerHTML = `
    <div class="row g-4">
      <div class="col-6">
        <div class="dashboard-stat text-primary">${stats.counts.total}</div>
        <div class="dashboard-stat-label">総サンプル数</div>
      </div>
      <div class="col-6">
        <div class="row">
          <div class="col-6">
            <div class="dashboard-stat" style="color: ${colors.extrovert.border}">${stats.counts.extroverts}</div>
            <div class="dashboard-stat-label">外向的</div>
          </div>
          <div class="col-6">
            <div class="dashboard-stat" style="color: ${colors.introvert.border}">${stats.counts.introverts}</div>
            <div class="dashboard-stat-label">内向的</div>
          </div>
        </div>
      </div>
    </div>
    <hr>
    <div class="progress mt-3" style="height: 25px;">
      <div class="progress-bar" role="progressbar" style="width: ${extrovertPercent}%; background-color: ${colors.extrovert.border};" 
        aria-valuenow="${extrovertPercent}" aria-valuemin="0" aria-valuemax="100">
        ${extrovertPercent}%
      </div>
      <div class="progress-bar" role="progressbar" style="width: ${introvertPercent}%; background-color: ${colors.introvert.border};" 
        aria-valuenow="${introvertPercent}" aria-valuemin="0" aria-valuemax="100">
        ${introvertPercent}%
      </div>
    </div>
    <div class="d-flex justify-content-between mt-2">
      <small>外向的</small>
      <small>内向的</small>
    </div>
  `;
}

// 分布チャートの描画
function renderDistributionChart(stats) {
  const ctx = document.getElementById('distribution-chart').getContext('2d');
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['外向的', '内向的'],
      datasets: [{
        label: '人数',
        data: [stats.counts.extroverts, stats.counts.introverts],
        backgroundColor: [
          colors.extrovert.primary,
          colors.introvert.primary
        ],
        borderColor: [
          colors.extrovert.border,
          colors.introvert.border
        ],
        borderWidth: 1
      }]
    },
    options: {
      ...chartDefaults,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: '性格タイプの分布'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  });
}

// 平均値比較チャートの描画
function renderAverageComparisonChart(stats) {
  const ctx = document.getElementById('avg-comparison-chart').getContext('2d');
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['一人で過ごす時間', '社交イベント参加', '外出頻度', '友人の数', '投稿頻度'],
      datasets: [
        {
          label: '外向的',
          data: [
            stats.averages.extroverts.timeAlone,
            stats.averages.extroverts.socialEvents,
            stats.averages.extroverts.goingOutside,
            stats.averages.extroverts.friendsCircle,
            stats.averages.extroverts.postFrequency
          ],
          backgroundColor: colors.extrovert.primary,
          borderColor: colors.extrovert.border,
          borderWidth: 1
        },
        {
          label: '内向的',
          data: [
            stats.averages.introverts.timeAlone,
            stats.averages.introverts.socialEvents,
            stats.averages.introverts.goingOutside,
            stats.averages.introverts.friendsCircle,
            stats.averages.introverts.postFrequency
          ],
          backgroundColor: colors.introvert.primary,
          borderColor: colors.introvert.border,
          borderWidth: 1
        }
      ]
    },
    options: {
      ...chartDefaults,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: '性格タイプ別の行動パターン (平均値)'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// 社会性レーダーチャートの描画
function renderSocialRadarChart(stats) {
  const ctx = document.getElementById('social-radar-chart').getContext('2d');
  
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['一人で過ごす時間', '社交イベント参加', '外出頻度', '友人の数', '投稿頻度'],
      datasets: [
        {
          label: '外向的',
          data: [
            stats.averages.extroverts.timeAlone,
            stats.averages.extroverts.socialEvents,
            stats.averages.extroverts.goingOutside,
            stats.averages.extroverts.friendsCircle,
            stats.averages.extroverts.postFrequency
          ],
          backgroundColor: colors.extrovert.light,
          borderColor: colors.extrovert.border,
          borderWidth: 2,
          pointBackgroundColor: colors.extrovert.border
        },
        {
          label: '内向的',
          data: [
            stats.averages.introverts.timeAlone,
            stats.averages.introverts.socialEvents,
            stats.averages.introverts.goingOutside,
            stats.averages.introverts.friendsCircle,
            stats.averages.introverts.postFrequency
          ],
          backgroundColor: colors.introvert.light,
          borderColor: colors.introvert.border,
          borderWidth: 2,
          pointBackgroundColor: colors.introvert.border
        }
      ]
    },
    options: {
      ...chartDefaults,
      aspectRatio: 1,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: '社会性指標の比較'
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          ticks: {
            display: false
          }
        }
      }
    }
  });
}

// ステージ恐怖症チャートの描画
function renderStageFearChart(stats) {
  const ctx = document.getElementById('stage-fear-chart').getContext('2d');
  
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['外向的 - あり', '外向的 - なし', '内向的 - あり', '内向的 - なし'],
      datasets: [{
        data: [
          stats.stageFear.extroverts.yes,
          stats.stageFear.extroverts.no,
          stats.stageFear.introverts.yes,
          stats.stageFear.introverts.no
        ],
        backgroundColor: [
          colors.extrovert.primary,
          colors.extrovert.light,
          colors.introvert.primary,
          colors.introvert.light
        ],
        borderColor: [
          colors.extrovert.border,
          colors.extrovert.border,
          colors.introvert.border,
          colors.introvert.border
        ],
        borderWidth: 1
      }]
    },
    options: {
      ...chartDefaults,
      aspectRatio: 1,
      plugins: {
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: 'ステージ恐怖症の割合'
        }
      }
    }
  });
}

// 社交後の疲労感チャートの描画
function renderDrainedChart(stats) {
  const ctx = document.getElementById('drained-chart').getContext('2d');
  
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['外向的 - あり', '外向的 - なし', '内向的 - あり', '内向的 - なし'],
      datasets: [{
        data: [
          stats.drainedAfterSocializing.extroverts.yes,
          stats.drainedAfterSocializing.extroverts.no,
          stats.drainedAfterSocializing.introverts.yes,
          stats.drainedAfterSocializing.introverts.no
        ],
        backgroundColor: [
          colors.extrovert.primary,
          colors.extrovert.light,
          colors.introvert.primary,
          colors.introvert.light
        ],
        borderColor: [
          colors.extrovert.border,
          colors.extrovert.border,
          colors.introvert.border,
          colors.introvert.border
        ],
        borderWidth: 1
      }]
    },
    options: {
      ...chartDefaults,
      aspectRatio: 1,
      plugins: {
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: '社交後の疲労感の割合'
        }
      }
    }
  });
}

// データテーブルの描画
function renderTable(data) {
  const tableBody = document.getElementById('data-body');
  const prevButton = document.getElementById('prev-page');
  const nextButton = document.getElementById('next-page');
  const dataShowing = document.getElementById('data-showing');
  
  // ページネーション計算
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);
  const maxPage = Math.ceil(data.length / itemsPerPage);
  
  // ボタン状態の更新
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === maxPage || data.length === 0;
  
  // 表示情報の更新
  dataShowing.textContent = data.length > 0 ? `${startIndex + 1}-${endIndex} / ${data.length}` : '0-0 / 0';
  
  // テーブル内容の更新
  if (data.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="8" class="text-center">データがありません</td></tr>';
    return;
  }
  
  tableBody.innerHTML = '';
  for (let i = startIndex; i < endIndex; i++) {
    const item = data[i];
    const row = document.createElement('tr');
    
    // 背景色の設定
    if (item.Personality === 'Extrovert') {
      row.classList.add('table-primary');
    } else if (item.Personality === 'Introvert') {
      row.classList.add('table-danger');
    }
    
    row.innerHTML = `
      <td>${item.Time_spent_Alone}</td>
      <td>${item.Stage_fear}</td>
      <td>${item.Social_event_attendance}</td>
      <td>${item.Going_outside}</td>
      <td>${item.Drained_after_socializing}</td>
      <td>${item.Friends_circle_size}</td>
      <td>${item.Post_frequency}</td>
      <td>${item.Personality}</td>
    `;
    
    tableBody.appendChild(row);
  }
} 