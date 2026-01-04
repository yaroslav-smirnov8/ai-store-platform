// Telegram WebApp utilities
export const initTelegramWebApp = () => {
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    
    // Initialize the app
    tg.ready();
    
    // Expand to full height
    tg.expand();
    
    // Enable closing confirmation
    tg.enableClosingConfirmation();
    
    // Set header color
    tg.setHeaderColor('#1f2937');
    
    return tg;
  }
  return null;
};

export const getTelegramUser = () => {
  if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
    return window.Telegram.WebApp.initDataUnsafe.user;
  }
  return null;
};

export const showMainButton = (text, onClick) => {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.MainButton.setText(text);
    tg.MainButton.show();
    tg.MainButton.onClick(onClick);
  }
};

export const hideMainButton = () => {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.MainButton.hide();
  }
};

export const showBackButton = (onClick) => {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.BackButton.show();
    tg.BackButton.onClick(onClick);
  }
};

export const hideBackButton = () => {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.BackButton.hide();
  }
};

export const hapticFeedback = (type = 'impact') => {
  const tg = window.Telegram?.WebApp;
  if (tg?.HapticFeedback) {
    switch (type) {
      case 'light':
        tg.HapticFeedback.impactOccurred('light');
        break;
      case 'medium':
        tg.HapticFeedback.impactOccurred('medium');
        break;
      case 'heavy':
        tg.HapticFeedback.impactOccurred('heavy');
        break;
      case 'success':
        tg.HapticFeedback.notificationOccurred('success');
        break;
      case 'error':
        tg.HapticFeedback.notificationOccurred('error');
        break;
      default:
        tg.HapticFeedback.impactOccurred('medium');
    }
  }
};

export const openTelegramLink = (url) => {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.openTelegramLink(url);
  } else {
    window.open(url, '_blank');
  }
};

export const openLink = (url) => {
  const tg = window.Telegram?.WebApp;
  if (tg) {
    tg.openLink(url);
  } else {
    window.open(url, '_blank');
  }
};
