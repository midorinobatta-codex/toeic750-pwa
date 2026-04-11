export function initSettingsModule() {
  const container = document.getElementById('settings-container');
  if (!container) return;

  const currentSettings = window.appInstance?.state.settings || { difficulty: 'normal', autoAdjust: false, speechRate: 1.0 };

  container.innerHTML = `
    <div class="card" style="margin-bottom: 20px;">
      <h3 style="margin-bottom: 16px;">難易度調整 (オンライン専用)</h3>
      
      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 8px; color: var(--text-secondary);">ベース難易度</label>
        <select id="select-difficulty" style="width: 100%; padding: 12px; border-radius: 8px; background: var(--bg-surface-elevated); color: var(--text-primary); border: 1px solid #444; font-size: 1rem;">
          <option value="easy" ${currentSettings.difficulty === 'easy' ? 'selected' : ''}>易しめ (目標 600点)</option>
          <option value="normal" ${currentSettings.difficulty === 'normal' ? 'selected' : ''}>通常 (目標 750点)</option>
          <option value="hard" ${currentSettings.difficulty === 'hard' ? 'selected' : ''}>難しめ (目標 850点)</option>
        </select>
        <p style="font-size: 0.8rem; color: var(--accent-blue); margin-top: 8px;">※変更時、オンライン環境から追加問題をダウンロードします</p>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-top: 1px solid var(--bg-surface-elevated);">
        <span style="font-weight: 500;">自動難易度調整（正答率連動）</span>
        <label class="toggle-switch" style="position: relative; display: inline-block; width: 50px; height: 26px;">
          <input type="checkbox" id="toggle-auto-adjust" ${currentSettings.autoAdjust ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
          <span class="slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--bg-surface-elevated); border-radius: 34px; transition: .4s;">
            <span class="slider-btn" style="position: absolute; height: 20px; width: 20px; left: 3px; bottom: 3px; background-color: white; border-radius: 50%; transition: .4s; ${currentSettings.autoAdjust ? 'transform: translateX(24px);' : ''}"></span>
          </span>
        </label>
      </div>
    </div>

    <div class="card">
      <h3 style="margin-bottom: 16px;">音声・環境設定</h3>
      
      <div style="margin-bottom: 16px;">
        <label style="display: block; margin-bottom: 8px; color: var(--text-secondary);">音声再生速度: <span id="rate-display">${currentSettings.speechRate}x</span></label>
        <input type="range" id="range-speech" min="0.5" max="1.5" step="0.1" value="${currentSettings.speechRate}" style="width: 100%; accent-color: var(--accent-emerald);">
      </div>

      <button id="btn-save" style="width: 100%; padding: 14px; margin-top: 10px; border-radius: 8px; background: var(--accent-violet); border: none; color: white; font-weight: bold; cursor: pointer;">設定を保存</button>
    </div>
  `;

  // Custom Toggle logic
  const toggleInput = document.getElementById('toggle-auto-adjust');
  const sliderBtn = container.querySelector('.slider-btn');
  const sliderBg = container.querySelector('.slider');
  
  // Set initial color if checked
  if(toggleInput.checked) sliderBg.style.backgroundColor = 'var(--accent-violet)';

  toggleInput.addEventListener('change', (e) => {
    if (e.target.checked) {
      sliderBtn.style.transform = 'translateX(24px)';
      sliderBg.style.backgroundColor = 'var(--accent-violet)';
    } else {
      sliderBtn.style.transform = 'translateX(0)';
      sliderBg.style.backgroundColor = 'var(--bg-surface-elevated)';
    }
  });

  // Range text update
  const rangeSpeech = document.getElementById('range-speech');
  const rateDisplay = document.getElementById('rate-display');
  rangeSpeech.addEventListener('input', (e) => {
    rateDisplay.innerText = `${parseFloat(e.target.value).toFixed(1)}x`;
  });

  document.getElementById('btn-save').addEventListener('click', () => {
    const newSettings = {
      difficulty: document.getElementById('select-difficulty').value,
      autoAdjust: document.getElementById('toggle-auto-adjust').checked,
      speechRate: parseFloat(document.getElementById('range-speech').value)
    };

    if (window.appInstance) {
      const oldDiff = window.appInstance.state.settings.difficulty;
      window.appInstance.state.settings = newSettings;
      window.appInstance.saveState();
      
      // Simulate fetching new data if difficulty changed
      if (oldDiff !== newSettings.difficulty) {
        if (navigator.onLine) {
          alert(`設定を保存しました。オンラインのため「${newSettings.difficulty}」レベルの追加問題データセットを自動取得しました。`);
        } else {
          alert(`設定を保存しました。現在はオフラインのため、オンライン復帰時に「${newSettings.difficulty}」レベルの問題データを取得します。`);
        }
      } else {
        alert('設定を保存しました。');
      }
    }
  });
}
