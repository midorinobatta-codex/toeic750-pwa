export function initStudyPlanModule() {
  const container = document.getElementById('home-tasks');
  if (!container) return;

  const currentDay = window.appInstance?.state.currentDay || 1;

  container.innerHTML = `
    <div class="card" style="margin-bottom: 20px;">
      <h3 style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
        <span>今日のタスク (Day ${currentDay})</span>
        <span class="badge highlight-blue">Phase 1</span>
      </h3>
      
      <ul style="list-style: none; padding: 0;">
        <li style="display: flex; align-items: center; gap: 10px; padding: 12px 0; border-bottom: 1px solid var(--bg-surface-elevated);">
          <input type="checkbox" style="width: 20px; height: 20px; accent-color: var(--accent-violet);">
          <span>単語 20語学習</span>
        </li>
        <li style="display: flex; align-items: center; gap: 10px; padding: 12px 0; border-bottom: 1px solid var(--bg-surface-elevated);">
          <input type="checkbox" style="width: 20px; height: 20px; accent-color: var(--accent-blue);">
          <span>文法 品詞の役割 (10問)</span>
        </li>
      </ul>
      <p style="text-align: right; margin-top: 10px; font-size: 0.8rem; color: var(--text-secondary);">進捗: 0%</p>
    </div>

    <div class="card">
      <h3 style="margin-bottom: 12px;">今週のスケジュール</h3>
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--bg-surface-elevated);">
        <span style="color: var(--accent-violet); font-weight: bold;">Day 1</span>
        <span style="font-size: 0.9rem;">語彙・品詞基礎</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--bg-surface-elevated);">
        <span style="color: var(--text-secondary);">Day 2</span>
        <span style="font-size: 0.9rem; color: var(--text-secondary);">時制・リスニング導入</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
        <span style="color: var(--text-secondary);">Day 3</span>
        <span style="font-size: 0.9rem; color: var(--text-secondary);">リーディングPart5導入</span>
      </div>
    </div>
  `;
}
