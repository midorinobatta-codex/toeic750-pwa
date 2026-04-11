import { listeningData } from '../data/listening.js';
import { speechUtils } from './speech.js';

export function initListeningModule() {
  const container = document.getElementById('listening-container');
  if (!container) return;

  let currentIndex = 0;
  let correctCount = 0;

  function renderQuestion(index) {
    if (index >= listeningData.length) {
      if (window.appInstance && listeningData.length > 0) {
        window.appInstance.saveProgress('listening', { correct: correctCount, total: listeningData.length });
      }
      container.innerHTML = '<div class="card"><p>今日のリスニング演習は完了です！</p><button onclick="document.querySelector(\'.nav-item[data-target=\\\'view-home\\\']\').click()" style="width:100%; padding:12px; margin-top:16px; border-radius:8px; background:var(--bg-surface-elevated); color:white; border:none; cursor:pointer;">ホームに戻る</button></div>';
      return;
    }

    const item = listeningData[index];
    
    let optionsHtml = '';
    const isOptionsHidden = (item.part === 1 || item.part === 2);
    const labels = ['A', 'B', 'C', 'D'];
    item.options.forEach((opt, idx) => {
      const displayText = isOptionsHidden ? `(${labels[idx]}) Tap to select` : `(${labels[idx]}) ${opt}`;
      optionsHtml += `<button class="listening-option" data-index="${idx}" style="display:block; width:100%; text-align:left; padding:12px; margin-bottom:8px; border-radius:8px; border:1px solid var(--bg-surface-elevated); background:var(--bg-surface); color:var(--text-primary); cursor:pointer;">${displayText}</button>`;
    });

    container.innerHTML = `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <span class="badge day-badge">Part ${item.part}</span>
          <button id="btn-play-audio" style="padding: 8px 16px; border-radius: 20px; background: var(--accent-emerald); border: none; color: white; display: flex; align-items: center; gap: 8px; font-weight: bold; cursor: pointer;">
            <span class="material-symbols-outlined">play_arrow</span> Play Audio
          </button>
        </div>
        
        <div id="script-container" style="display:none; background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; margin-bottom: 20px; font-style: italic;">
          ${item.script.replace(/\n/g, '<br>')}
        </div>
        
        ${item.question ? `<h3 style="margin-bottom: 16px;">${item.question}</h3>` : ''}
        
        <div id="options-container">
          ${optionsHtml}
        </div>

        <div id="feedback-container" style="display:none; margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--bg-surface-elevated);">
          <h4 id="feedback-result" style="font-size: 1.2rem; margin-bottom: 8px;"></h4>
          <p style="color: var(--text-secondary); margin-bottom: 16px;">${item.explanation}</p>
          <button id="btn-next" style="width: 100%; padding: 12px; border-radius: 8px; background: var(--accent-emerald); border: none; color: white; font-weight: bold; cursor: pointer;">次へ</button>
        </div>
      </div>
    `;

    document.getElementById('btn-play-audio').addEventListener('click', () => {
      let textToSpeak = item.script;
      // Part 1, 2など選択肢が隠れている場合は、音声で選択肢も読み上げる
      if (isOptionsHidden && item.options && item.options.length > 0) {
        textToSpeak += ' ... ';
        item.options.forEach((opt, idx) => {
          textToSpeak += `${labels[idx]}. ${opt} ... `;
        });
      }
      speechUtils.speak(textToSpeak);
    });

    const optionBtns = container.querySelectorAll('.listening-option');
    optionBtns.forEach((btn, idx) => {
      btn.addEventListener('click', (e) => {
        // Show actual text of options
        optionBtns.forEach((b, i) => {
          b.disabled = true;
          b.style.cursor = 'default';
          b.innerText = `(${labels[i]}) ${item.options[i]}`;
        });
        
        // Show Script
        document.getElementById('script-container').style.display = 'block';

        const selectedIndex = parseInt(e.target.getAttribute('data-index'));
        const feedbackContainer = document.getElementById('feedback-container');
        const feedbackResult = document.getElementById('feedback-result');

        if (selectedIndex === item.answer) {
          correctCount++;
          e.target.style.backgroundColor = 'rgba(5, 150, 105, 0.2)';
          e.target.style.borderColor = 'var(--accent-emerald)';
          feedbackResult.innerText = 'Correct! 🎉';
          feedbackResult.style.color = 'var(--accent-emerald)';
        } else {
          e.target.style.backgroundColor = 'rgba(220, 38, 38, 0.2)';
          e.target.style.borderColor = 'var(--accent-ruby)';
          
          optionBtns[item.answer].style.backgroundColor = 'rgba(5, 150, 105, 0.2)';
          optionBtns[item.answer].style.borderColor = 'var(--accent-emerald)';
          
          feedbackResult.innerText = 'Incorrect';
          feedbackResult.style.color = 'var(--accent-ruby)';
        }

        feedbackContainer.style.display = 'block';
      });
    });

    document.getElementById('feedback-container').addEventListener('click', (e) => {
      if (e.target.id === 'btn-next') {
        speechUtils.speak(''); // Stop audio if still playing
        currentIndex++;
        renderQuestion(currentIndex);
      }
    });
  }

  renderQuestion(currentIndex);
}
