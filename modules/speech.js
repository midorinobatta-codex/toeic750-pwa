export const speechUtils = {
  speak(text) {
    if (!window.speechSynthesis) {
      console.warn('SpeechSynthesis API is not supported in this browser.');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    
    // Check if voice rate is set in settings
    if (window.appInstance && window.appInstance.state && window.appInstance.state.settings) {
      utterance.rate = window.appInstance.state.settings.speechRate || 1.0;
    }

    window.speechSynthesis.speak(utterance);
  }
};
