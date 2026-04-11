import { readingData } from '../data/reading.js';

export function initReadingModule() {
  const container = document.getElementById('reading-container');
  if (!container) return;

  let currentIndex = 0;
  let correctCount = 0;

  function renderQuestion(index) {
    if (index >= readingData.length) {
      if (window.appInstance && readingData.length > 0) {
        window.appInstance.saveProgress('reading', { correct: correctCount, total: readingData.length });
      }
      container.innerHTML = '<div class="card"><p>今日のリーディング演習は完了です！</p><button onclick="document.querySelector(\'.nav-item[data-target=\\\'view-home\\\']\').click()" style="width:100%; padding:12px; margin-top:16px; border-radius:8px; background:var(--bg-surface-elevated); color:white; border:none; cursor:pointer;">ホームに戻る</button></div>';
      return;
    }

    const item = readingData[index];
    
    let optionsHtml = '';
    item.options.forEach((opt, idx) => {
      optionsHtml += `<button class="reading-option" data-index="${idx}" style="display:block; width:100%; text-align:left; padding:12px; margin-bottom:8px; border-radius:8px; border:1px solid var(--bg-surface-elevated); background:var(--bg-surface); color:var(--text-primary); cursor:pointer;">${idx + 1}. ${opt}</button>`;
    });

    container.innerHTML = `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <span class="badge day-badge">Part ${item.part}</span>
          <span id="reading-timer" style="font-family: monospace; font-size: 1.1rem; color: var(--accent-amber);">00:00</span>
        </div>
        
        ${item.passage ? `
          <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; margin-bottom: 24px; line-height: 1.6; font-size: 0.95rem;">
            ${item.passage.replace(/\n/g, '<br>')}
          </div>
        ` : ''}
        
        <h3 style="margin-bottom: 20px; font-size: 1.1rem; line-height: 1.5;">${item.question}</h3>
        
        <div id="options-container">
          ${optionsHtml}
        </div>

        <div id="feedback-container" style="display:none; margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--bg-surface-elevated);">
          <h4 id="feedback-result" style="font-size: 1.2rem; margin-bottom: 8px;"></h4>
          <p style="color: var(--text-secondary); margin-bottom: 16px;">${item.explanation}</p>
          <button id="btn-next" style="width: 100%; padding: 12px; border-radius: 8px; background: var(--accent-amber); border: none; color: #000; font-weight: bold; cursor: pointer;">次へ</button>
        </div>
      </div>
    `;

    // Simple timer
    let seconds = 0;
    const timerEl = document.getElementById('reading-timer');
    const timerInterval = setInterval(() => {
      seconds++;
      const m = Math.floor(seconds / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      timerEl.innerText = `${m}:${s}`;
    }, 1000);

    const optionBtns = container.querySelectorAll('.reading-option');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        clearInterval(timerInterval);
        
        optionBtns.forEach(b => {
          b.disabled = true;
          b.style.cursor = 'default';
        });

        const selectedIndex = parseInt(e.target.getAttribute('data-index'));
        const feedbackContainer = document.getElementById('feedback-container');
        const feedbackResult = document.getElementById('feedback-result');

        if (selectedIndex === item.answer) {
          correctCount++;
          e.target.style.backgroundColor = 'rgba(5, 150, 105, 0.2)';
          e.target.style.borderColor = 'var(--accent-emerald)';
          feedbackResult.innerText = `Correct! 🎉 (Time: ${timerEl.innerText})`;
          feedbackResult.style.color = 'var(--accent-emerald)';
        } else {
          e.target.style.backgroundColor = 'rgba(220, 38, 38, 0.2)';
          e.target.style.borderColor = 'var(--accent-ruby)';
          
          optionBtns[item.answer].style.backgroundColor = 'rgba(5, 150, 105, 0.2)';
          optionBtns[item.answer].style.borderColor = 'var(--accent-emerald)';
          
          feedbackResult.innerText = `Incorrect (Time: ${timerEl.innerText})`;
          feedbackResult.style.color = 'var(--accent-ruby)';
        }

        feedbackContainer.style.display = 'block';
      });
    });

    document.getElementById('feedback-container').addEventListener('click', (e) => {
      if (e.target.id === 'btn-next') {
        currentIndex++;
        renderQuestion(currentIndex);
      }
    });
  }

  renderQuestion(currentIndex);
}
