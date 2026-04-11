import { grammarData } from '../data/grammar.js';

export function initGrammarModule() {
  const container = document.getElementById('grammar-container');
  if (!container) return;

  let currentIndex = 0;
  let correctCount = 0;

  function renderQuestion(index) {
    if (index >= grammarData.length) {
      if (window.appInstance && grammarData.length > 0) {
        window.appInstance.saveProgress('grammar', { correct: correctCount, total: grammarData.length });
      }
      container.innerHTML = '<div class="card"><p>今日の文法演習は完了です！</p><button onclick="document.querySelector(\'.nav-item[data-target=\\\'view-home\\\']\').click()" style="width:100%; padding:12px; margin-top:16px; border-radius:8px; background:var(--bg-surface-elevated); color:white; border:none; cursor:pointer;">ホームに戻る</button></div>';
      return;
    }

    const item = grammarData[index];
    
    let optionsHtml = '';
    item.options.forEach((opt, idx) => {
      optionsHtml += `<button class="grammar-option" data-index="${idx}" style="display:block; width:100%; text-align:left; padding:12px; margin-bottom:8px; border-radius:8px; border:1px solid var(--bg-surface-elevated); background:var(--bg-surface); color:var(--text-primary); cursor:pointer;">${idx + 1}. ${opt}</button>`;
    });

    container.innerHTML = `
      <div class="card">
        <div style="background: rgba(37, 99, 235, 0.1); padding: 12px; border-left: 4px solid var(--accent-blue); margin-bottom: 20px; border-radius: 4px;">
          <p style="font-size: 0.9rem; color: #60A5FA;">Rule: ${item.category.replace('_', ' ').toUpperCase()}</p>
          <p style="font-size: 0.95rem; margin-top: 4px;">${item.rule}</p>
        </div>
        
        <h3 style="font-size: 1.2rem; margin-bottom: 20px; line-height: 1.5;">${item.question}</h3>
        
        <div id="options-container">
          ${optionsHtml}
        </div>

        <div id="feedback-container" style="display:none; margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--bg-surface-elevated);">
          <h4 id="feedback-result" style="font-size: 1.2rem; margin-bottom: 8px;"></h4>
          <p style="color: var(--text-secondary); margin-bottom: 16px;">${item.explanation}</p>
          <button id="btn-next" style="width: 100%; padding: 12px; border-radius: 8px; background: var(--accent-blue); border: none; color: white; font-weight: bold; cursor: pointer;">次へ</button>
        </div>
      </div>
    `;

    const optionBtns = container.querySelectorAll('.grammar-option');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Disable all buttons
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
          feedbackResult.innerText = 'Correct! 🎉';
          feedbackResult.style.color = 'var(--accent-emerald)';
        } else {
          e.target.style.backgroundColor = 'rgba(220, 38, 38, 0.2)';
          e.target.style.borderColor = 'var(--accent-ruby)';
          
          // Highlight correct answer
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
        currentIndex++;
        renderQuestion(currentIndex);
      }
    });
  }

  renderQuestion(currentIndex);
}
