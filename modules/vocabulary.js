import { vocabularyData } from '../data/vocabulary.js';
import { speechUtils } from './speech.js';

export function initVocabularyModule() {
  const container = document.getElementById('vocab-container');
  
  if (!container) return;

  // Render first vocab card
  let currentIndex = 0;
  
  function renderCard(index) {
    if (index >= vocabularyData.length) {
      if (window.appInstance && vocabularyData.length > 0) {
        window.appInstance.saveProgress('vocabulary', { learnedCount: vocabularyData.length });
      }
      container.innerHTML = '<div class="card"><p>今日の単語タスクは完了です！</p><button onclick="document.querySelector(\'.nav-item[data-target=\\\'view-home\\\']\').click()" style="width:100%; padding:12px; margin-top:16px; border-radius:8px; background:var(--bg-surface-elevated); color:white; border:none; cursor:pointer;">ホームに戻る</button></div>';
      return;
    }

    const item = vocabularyData[index];
    
    container.innerHTML = `
      <div class="card vocab-card" id="current-vocab-card">
        <div class="card-front">
          <div style="display: flex; justify-content: space-between;">
            <span class="badge day-badge">Day ${item.day}</span>
            <button class="icon-btn" id="btn-speak" aria-label="発音を聞く">
              <span class="material-symbols-outlined">volume_up</span>
            </button>
          </div>
          <h1 style="text-align: center; font-size: 2.5rem; margin: 20px 0;">${item.word}</h1>
          <p style="text-align: center; color: var(--text-secondary);">${item.phonetic}</p>
          <p style="text-align: center; margin-top: 10px; font-size: 0.9rem; color: var(--text-muted);">タップして意味を確認</p>
        </div>
        
        <div class="card-back" style="display: none; margin-top: 20px; border-top: 1px solid var(--bg-surface-elevated); padding-top: 20px;">
          <p style="color: var(--accent-violet); font-weight: bold; margin-bottom: 8px;">${item.pos}</p>
          <h2 style="font-size: 1.5rem; margin-bottom: 16px;">${item.meaning}</h2>
          
          <div style="background-color: var(--bg-surface-elevated); padding: 12px; border-radius: 8px; margin-bottom: 16px;">
            <p style="font-style: italic; margin-bottom: 4px;">${item.example}</p>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">${item.exampleJa}</p>
          </div>
          
          <div style="display: flex; gap: 10px;">
            <button id="btn-forget" style="flex: 1; padding: 12px; border-radius: 8px; border: 1px solid var(--accent-ruby); background: transparent; color: var(--accent-ruby); font-weight: bold;">もう一度</button>
            <button id="btn-remember" style="flex: 1; padding: 12px; border-radius: 8px; background: var(--accent-violet); border: none; color: white; font-weight: bold;">覚えた</button>
          </div>
        </div>
      </div>
    `;

    // Event Listeners
    document.getElementById('current-vocab-card').addEventListener('click', (e) => {
      // Prevent flipping if buttons are clicked
      if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
      const back = document.querySelector('.card-back');
      if (back) back.style.display = back.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('btn-speak').addEventListener('click', (e) => {
      e.stopPropagation();
      speechUtils.speak(item.word);
    });

    // Flip actions
    const btnForget = document.getElementById('btn-forget');
    const btnRemember = document.getElementById('btn-remember');

    if(btnForget) {
      btnForget.addEventListener('click', (e) => {
        e.stopPropagation();
        // Record progress in state...
        currentIndex++;
        renderCard(currentIndex);
      });
    }

    if(btnRemember) {
      btnRemember.addEventListener('click', (e) => {
        e.stopPropagation();
        // Record progress in state...
        currentIndex++;
        renderCard(currentIndex);
      });
    }
  }

  renderCard(currentIndex);
}
