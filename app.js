import { initVocabularyModule } from './modules/vocabulary.js';
import { initGrammarModule } from './modules/grammar.js';
import { initListeningModule } from './modules/listening.js';
import { initReadingModule } from './modules/reading.js';
import { initPracticeModule } from './modules/practice.js';
import { initDashboardModule } from './modules/dashboard.js';
import { initStudyPlanModule } from './modules/study-plan.js';
import { initSettingsModule } from './modules/settings.js';

const APP_VERSION = '1.0.0';
const STATE_KEY = 'toeic750_state';

// Default initial state
const defaultState = {
  startDate: new Date().toISOString().split('T')[0],
  currentDay: 1,
  vocabulary: { learned: [], reviewing: [], intervals: {}, scores: [] },
  grammar: { completed: [], scores: [] },
  listening: { completed: [], scores: [] },
  reading: { completed: [], scores: [] },
  practice: { tests: [] },
  history: [],
  settings: {
    difficulty: 'normal',
    autoAdjust: false,
    speechRate: 1.0,
  }
};

class App {
  constructor() {
    this.state = this.loadState();
    this.initPWA();
    this.initNavigation();
    this.updateHomeView();
  }

  loadState() {
    const saved = localStorage.getItem(STATE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    localStorage.setItem(STATE_KEY, JSON.stringify(defaultState));
    return { ...defaultState };
  }

  saveState() {
    localStorage.setItem(STATE_KEY, JSON.stringify(this.state));
  }

  saveProgress(moduleName, data) {
    if (!this.state.history) this.state.history = [];
    
    this.state.history.push({
      date: new Date().toISOString().split('T')[0],
      day: this.state.currentDay,
      module: moduleName,
      timestamp: Date.now(),
      ...data
    });
    
    this.saveState();
  }

  initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view');
    const headerTitle = document.getElementById('header-title');

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        // Update active class on nav
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        // Show target view
        const targetId = item.getAttribute('data-target');
        views.forEach(view => {
          if (view.id === targetId) {
            view.classList.add('active');
          } else {
            view.classList.remove('active');
          }
        });

        // Update header title based on span text
        const titleText = item.querySelector('span:last-child').innerText;
        headerTitle.innerText = titleText === 'Home' ? 'Home' : titleText;
        
        this.initModuleForView(targetId);
      });
    });

    // Dashboard shortcut
    document.getElementById('card-dashboard').addEventListener('click', () => {
      navItems.forEach(nav => nav.classList.remove('active'));
      views.forEach(v => v.classList.remove('active'));
      document.getElementById('view-dashboard').classList.add('active');
      headerTitle.innerText = 'Dashboard';
      this.initModuleForView('view-dashboard');
    });
    
    // Settings shortcut
    document.getElementById('btn-settings').addEventListener('click', () => {
      navItems.forEach(nav => nav.classList.remove('active'));
      views.forEach(v => v.classList.remove('active'));
      document.getElementById('view-settings').classList.add('active');
      headerTitle.innerText = 'Settings';
      this.initModuleForView('view-settings');
    });
  }

  initModuleForView(viewId) {
    if (viewId === 'view-home') this.updateHomeView();
    if (viewId === 'view-vocabulary') initVocabularyModule();
    if (viewId === 'view-grammar') initGrammarModule();
    if (viewId === 'view-listening') initListeningModule();
    if (viewId === 'view-reading') initReadingModule();
    if (viewId === 'view-practice') initPracticeModule();
    if (viewId === 'view-dashboard') initDashboardModule();
    if (viewId === 'view-settings') initSettingsModule();
  }

  updateHomeView() {
    document.getElementById('home-day').innerText = this.state.currentDay;
    initStudyPlanModule();
  }

  initPWA() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(registration => {
            console.log('ServiceWorker registered with scope:', registration.scope);
          })
          .catch(error => {
            console.error('ServiceWorker registration failed:', error);
          });
      });
    }
  }
}

// Initialize Application once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.appInstance = new App();
});
