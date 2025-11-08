import { Platform } from 'react-native';

let toast;

if (Platform.OS === 'web') {
  // Use react-hot-toast for web
  const hotToast = require('react-hot-toast');
  toast = {
    show: (message, duration = 'short') => {
      hotToast.toast(message, {
        duration: duration === 'long' ? 4000 : 2000,
      });
    },
    showWithGravity: (message, duration, gravity) => {
      const position = gravity === 'bottom' ? 'bottom-center' : 'top-center';
      hotToast.toast(message, {
        duration: duration === 'long' ? 4000 : 2000,
        position: position,
      });
    },
  };
} else {
  // Use react-native-simple-toast for mobile
  const Toast = require('react-native-simple-toast').default;
  toast = Toast;
}

export default toast;