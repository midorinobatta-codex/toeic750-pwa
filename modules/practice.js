import { practiceData } from '../data/practice.js';
import { speechUtils } from './speech.js';

export function initPracticeModule() {
  const container = document.getElementById('practice-container');
  if (!container) return;

  const test = practiceData[0]; // load the first mock test

  container.innerHTML = `
    <div class="card" style="text-align: center; padding: 30px 20px;">
      <h2 style="margin-bottom: 10px;">${test.title}</h2>
      <p style="color: var(--text-secondary); margin-bottom: 20px;">Day ${test.day} の模擬テスト</p>
      <div style="background: var(--bg-surface-elevated); padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: left;">
        <p style="margin-bottom: 8px;"><strong>設問数:</strong> ${test.questions.length} 問</p>
        <p style="margin-bottom: 8px;"><strong>予想所要時間:</strong> 約2分</p>
        <p style="color: var(--accent-ruby); font-size: 0.9rem;">※途中で中断することはできません</p>
      </div>
      <button id="btn-start-test" style="width: 100%; padding: 16px; border-radius: 8px; background: var(--accent-ruby); border: none; color: white; font-weight: bold; font-size: 1.1rem; cursor: pointer;">
        テスト開始
      </button>
    </div>
  `;

  document.getElementById('btn-start-test')?.addEventListener('click', () => {
    startTest(test);
  });

  function startTest(testData) {
    let currentIndex = 0;
    const userAnswers = [];

    function renderQuestion() {
      if (currentIndex >= testData.questions.length) {
        showResults(testData, userAnswers);
        return;
      }

      const q = testData.questions[currentIndex];
      const isOptionsHidden = (q.part === 1 || q.part === 2);
      const labels = ['A', 'B', 'C', 'D'];
      let optionsHtml = '';
      q.options.forEach((opt, idx) => {
        const displayText = isOptionsHidden ? `(${labels[idx]}) Tap to select` : `(${labels[idx]}) ${opt}`;
        optionsHtml += `<button class="test-option" data-index="${idx}" style="display:block; width:100%; text-align:left; padding:12px; margin-bottom:8px; border-radius:8px; border:1px solid var(--bg-surface-elevated); background:var(--bg-surface); color:var(--text-primary); cursor:pointer;">${displayText}</button>`;
      });

      container.innerHTML = `
        <div class="card">
          <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
            <span class="badge highlight-ruby">Q ${currentIndex + 1} / ${testData.questions.length}</span>
            <span class="badge day-badge">Part ${q.part}</span>
          </div>
          
          ${q.section === 'listening' ? `
            <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
              <span class="material-symbols-outlined" style="font-size: 48px; color: var(--accent-emerald);">headphones</span>
              <p style="margin-top: 8px; margin-bottom: 16px;">音声を聞いて解答してください</p>
              <button id="btn-test-play-audio" style="padding: 10px 24px; border-radius: 24px; background: var(--accent-emerald); border: none; color: white; display: inline-flex; align-items: center; gap: 8px; font-weight: bold; cursor: pointer;">
                <span class="material-symbols-outlined">play_arrow</span> Play Audio
              </button>
            </div>
          ` : ''}

          ${q.passage ? `
            <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; margin-bottom: 20px; line-height: 1.6;">
              ${q.passage}
            </div>
          ` : ''}

          ${q.question ? `<h3 style="margin-bottom: 20px;">${q.question}</h3>` : ''}

          <div id="options-container">
            ${optionsHtml}
          </div>
        </div>
      `;

      const btnPlayAudio = document.getElementById('btn-test-play-audio');
      if (btnPlayAudio) {
        btnPlayAudio.addEventListener('click', () => {
          let textToSpeak = q.script;
          if (isOptionsHidden && q.options && q.options.length > 0) {
            textToSpeak += ' ... ';
            q.options.forEach((opt, idx) => {
              textToSpeak += `${labels[idx]}. ${opt} ... `;
            });
          }
          speechUtils.speak(textToSpeak);
        });
      }

      const optionBtns = container.querySelectorAll('.test-option');
      optionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          speechUtils.speak(''); // 次の問題に行く前に音声を停止

          const selectedIndex = parseInt(e.target.getAttribute('data-index'));
          userAnswers.push(selectedIndex);
          currentIndex++;
          renderQuestion();
        });
      });
    }

    renderQuestion();
  }

  function showResults(testData, userAnswers) {
    let correct = 0;
    testData.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) correct++;
    });

    const score = Math.round((correct / testData.questions.length) * 990); // Dummy calc

    if (window.appInstance) {
      window.appInstance.saveProgress('practice', {
        score: score,
        correct: correct,
        total: testData.questions.length
      });
    }

    let reviewHtml = '';
    const labels = ['A', 'B', 'C', 'D'];
    testData.questions.forEach((q, idx) => {
      const isCorrect = userAnswers[idx] === q.answer;
      const resultIcon = isCorrect ? '<span style="color:var(--accent-emerald);">○ 正解</span>' : '<span style="color:var(--accent-ruby);">× 不正解</span>';
      
      let qText = '';
      if (q.section === 'listening') qText += `<span class="material-symbols-outlined" style="font-size:16px; vertical-align:middle; margin-right:4px;">headphones</span>[Audio] ${q.script}<br>`;
      if (q.question) qText += `<strong>Q:</strong> ${q.question}<br>`;
      if (q.passage) qText += `<em style="color:var(--text-secondary);">📝 長文省略...</em><br>`;

      const userAnswerText = `(${labels[userAnswers[idx]]}) ${q.options[userAnswers[idx]]}`;
      const correctAnswerText = `(${labels[q.answer]}) ${q.options[q.answer]}`;

      reviewHtml += `
        <div style="background: var(--bg-surface-elevated); padding: 16px; border-radius: 8px; margin-bottom: 12px; text-align: left;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-weight: bold;">
            <span>Q${idx + 1} <span class="badge highlight-blue" style="font-size:0.7rem; margin-left:8px;">Part ${q.part}</span></span>
            ${resultIcon}
          </div>
          <div style="margin-bottom: 12px; font-size: 0.95rem; color: var(--text-primary); line-height: 1.5;">
            ${qText}
          </div>
          <div style="font-size: 0.9rem; margin-bottom: 8px; line-height: 1.6;">
            <div>あなたの回答: <span style="color: ${isCorrect ? 'var(--accent-emerald)' : 'var(--accent-ruby)'};">${userAnswerText}</span></div>
            ${!isCorrect ? `<div>正解: <span style="color: var(--accent-emerald);">${correctAnswerText}</span></div>` : ''}
          </div>
          ${q.explanation ? `<div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 4px; font-size: 0.85rem; color: var(--text-secondary); margin-top: 12px;"><strong>解説:</strong> ${q.explanation}</div>` : ''}
        </div>
      `;
    });

    container.innerHTML = `
      <div class="card" style="text-align: center; padding: 40px 20px;">
        <h2 style="margin-bottom: 20px;">Result</h2>
        <div style="width: 150px; height: 150px; border-radius: 50%; border: 8px solid var(--accent-ruby); display: flex; align-items: center; justify-content: center; margin: 0 auto 30px;">
          <span style="font-size: 2.5rem; font-weight: bold;">${score}</span>
        </div>
        <p style="margin-bottom: 10px; font-size: 1.2rem;">正答数: ${correct} / ${testData.questions.length}</p>
        <p style="color: var(--text-secondary); margin-bottom: 30px;">お疲れ様でした。復習をしっかり行いましょう。</p>
        
        <div style="margin-top: 30px; margin-bottom: 30px; text-align: left;">
          <h3 style="margin-bottom: 16px; border-left: 4px solid var(--accent-blue); padding-left: 8px;">復習・レビュー</h3>
          ${reviewHtml}
        </div>

        <button id="btn-finish" style="width: 100%; padding: 14px; border-radius: 8px; background: var(--bg-surface-elevated); border: none; color: white; font-weight: bold; cursor: pointer;">
          ホームに戻る
        </button>
      </div>
    `;

    document.getElementById('btn-finish')?.addEventListener('click', () => {
      document.querySelector('.nav-item[data-target="view-home"]').click();
    });
  }
}
