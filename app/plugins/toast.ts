import Vue3Toastify, { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { h, type FunctionalComponent } from 'vue';
import { Icon } from '#components';

/** Green circle with lucide:check-check — matches AdRequestCard + design toast */
const SuccessIcon: FunctionalComponent = () =>
  h(
    'span',
    {
      class: 'toast-success-icon',
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        borderRadius: '9999px',
        background: '#06c399',
        color: '#fff',
        flexShrink: '0',
      },
    },
    [
      h(Icon, {
        name: 'lucide:check-check',
        size: '16',
      }),
    ],
  );

/** Red circle with white X — matches design error toast */
const ErrorIcon: FunctionalComponent = () =>
  h(
    'svg',
    {
      viewBox: '0 0 24 24',
      width: '28',
      height: '28',
      fill: 'none',
      'aria-hidden': 'true',
    },
    [
      h('circle', {
        cx: '12',
        cy: '12',
        r: '12',
        fill: '#E11D48',
      }),
      h('path', {
        d: 'M8 8l8 8M16 8l-8 8',
        stroke: '#fff',
        'stroke-width': '2',
        'stroke-linecap': 'round',
      }),
    ],
  );

/** Brown circle with white "i" — matches design warning toast */
const WarningIcon: FunctionalComponent = () =>
  h(
    'svg',
    {
      viewBox: '0 0 24 24',
      width: '28',
      height: '28',
      fill: 'none',
      'aria-hidden': 'true',
    },
    [
      h('circle', {
        cx: '12',
        cy: '12',
        r: '12',
        fill: '#8B5E3C',
      }),
      h('circle', {
        cx: '12',
        cy: '8',
        r: '1.35',
        fill: '#fff',
      }),
      h('path', {
        d: 'M12 11.25v6',
        stroke: '#fff',
        'stroke-width': '2.2',
        'stroke-linecap': 'round',
      }),
    ],
  );

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Toastify, {
    autoClose: 5000,
    rtl: true,
    position: 'bottom-left',
    toastClassName: 'toast-custom',
    theme: 'light',
  });

  const originalSuccess = toast.success.bind(toast);
  const originalError = toast.error.bind(toast);
  const originalWarning = toast.warning.bind(toast);

  const success: typeof toast.success = (message, options) =>
    originalSuccess(message, {
      ...options,
      icon: SuccessIcon,
      theme: 'light',
    });

  const error: typeof toast.error = (message, options) =>
    originalError(message, {
      ...options,
      icon: ErrorIcon,
      theme: 'light',
    });

  const warning: typeof toast.warning = (message, options) =>
    originalWarning(message, {
      ...options,
      icon: WarningIcon,
      theme: 'light',
    });

  return {
    provide: {
      toast: Object.assign(toast, { success, error, warning, warn: warning }),
    },
  };
});
