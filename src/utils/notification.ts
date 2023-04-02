import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';

const toast = useToast();

export const $toast = (message: string, type: string, pos: any) =>
  toast.open({
    position: pos,
    duration: 2000,
    dismissible: true,
    message: message,
    type: type,
  });
