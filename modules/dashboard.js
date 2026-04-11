export function initDashboardModule() {
  const container = document.getElementById('dashboard-container');
  if (!container) return;

  const history = window.appInstance?.state.history || [];

  // スコア推移データの算出
  const practiceHist = history.filter(h => h.module === 'practice');
  let scoreLabels = ['Start'];
  let scoreData = [450]; // 初期推定スコア

  if (practiceHist.length > 0) {
    practiceHist.forEach(h => {
      scoreLabels.push(\`Day \${h.day}\`);
      scoreData.push(h.score);
    });
  } else {
    scoreLabels = [...scoreLabels, 'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'];
    scoreData = [...scoreData, 480, 510, 540, 570, 580];
  }

  const currentScore = scoreData[scoreData.length - 1];
  const targetScore = 750;
  const remaining = Math.max(0, targetScore - currentScore);

  // レーダーチャート（正答率などの算出）
  function getAccuracy(moduleNames) {
    let totalQs = 0;
    let correctQs = 0;
    history.forEach(h => {
      if (moduleNames.includes(h.module) && h.total) {
        totalQs += h.total;
        correctQs += h.correct;
      }
    });
    return totalQs === 0 ? 50 : Math.round((correctQs / totalQs) * 100);
  }

  const radarData = [
    50 + (history.filter(h => h.module === 'vocabulary').length * 2), // 単語力は学習回数ベース（仮）
    getAccuracy(['grammar']),
    getAccuracy(['listening', 'practice_listen']),
    getAccuracy(['reading', 'practice_read']),
    Math.min(100, 30 + (practiceHist.length * 10)) // 時間配分はテスト実施回数で向上（仮）
  ].map(v => Math.min(100, Math.max(0, v)));

  container.innerHTML = \`
    <div class="card">
      <h3 style="margin-bottom: 16px;">ダッシュボード</h3>
      
      <div style="display: flex; gap: 10px; margin-bottom: 20px;">
        <div style="flex: 1; background: var(--bg-surface-elevated); padding: 12px; border-radius: 8px; text-align: center;">
          <p style="font-size: 0.8rem; color: var(--text-secondary);">推定スコア</p>
          <p style="font-size: 1.5rem; font-weight: bold; color: var(--accent-violet);">\${currentScore}</p>
        </div>
        <div style="flex: 1; background: var(--bg-surface-elevated); padding: 12px; border-radius: 8px; text-align: center;">
          <p style="font-size: 0.8rem; color: var(--text-secondary);">目標まで</p>
          <p style="font-size: 1.5rem; font-weight: bold;">\${remaining}</p>
        </div>
      </div>

      <div style="height: 250px; margin-bottom: 30px;">
        <canvas id="score-chart"></canvas>
      </div>

      <div style="height: 250px;">
        <canvas id="radar-chart"></canvas>
      </div>
    </div>
  \`;

  // Wait a tick for DOM
  setTimeout(() => {
    if (window.Chart) {
      // Line Chart for score progress
      const ctxLine = document.getElementById('score-chart').getContext('2d');
      new Chart(ctxLine, {
        type: 'line',
        data: {
          labels: scoreLabels,
          datasets: [{
            label: '推定スコア推移',
            data: scoreData,
            borderColor: '#7C3AED',
            tension: 0.3,
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              min: 0,
              max: 990,
              grid: { color: 'rgba(255,255,255,0.1)' },
              ticks: { color: '#AAAAAA' }
            },
            x: {
              grid: { color: 'rgba(255,255,255,0.1)' },
              ticks: { color: '#AAAAAA' }
            }
          }
        }
      });

      // Radar Chart for skills
      const ctxRadar = document.getElementById('radar-chart').getContext('2d');
      new Chart(ctxRadar, {
        type: 'radar',
        data: {
          labels: ['単語', '文法', 'リスニング', 'リーディング', '時間配分'],
          datasets: [{
            label: '現在の実力 (%)',
            data: radarData,
            backgroundColor: 'rgba(37, 99, 235, 0.2)',
            borderColor: '#2563EB',
            pointBackgroundColor: '#2563EB'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              min: 0,
              max: 100,
              grid: { color: 'rgba(255,255,255,0.1)' },
              pointLabels: { color: '#FFFFFF', font: { size: 12 } },
              angleLines: { color: 'rgba(255,255,255,0.1)' }
            }
          },
          plugins: { legend: { display: false } }
        }
      });
    }
  }, 100);
}
