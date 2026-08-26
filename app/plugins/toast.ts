import Vue3Toastify, { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { h, type FunctionalComponent } from "vue";

function circleIcon(
  fill: string,
  paths: Array<Record<string, string>>,
): FunctionalComponent {
  return () =>
    h(
      "svg",
      {
        viewBox: "0 0 24 24",
        width: "28",
        height: "28",
        fill: "none",
        "aria-hidden": "true",
        style: { display: "block", flexShrink: "0" },
      },
      [
        h("circle", { cx: "12", cy: "12", r: "12", fill }),
        ...paths.map((attrs) => h("path", attrs)),
      ],
    );
}

const SuccessIcon = circleIcon("#06c399", [
  {
    d: "M17.4 7 7.5 16.57 3 12.22M21 10.48 14.25 17 12.9 15.7",
    stroke: "#fff",
    "stroke-width": "1.8",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
  },
]);

const ErrorIcon = circleIcon("#E11D48", [
  {
    d: "M8 8l8 8M16 8l-8 8",
    stroke: "#fff",
    "stroke-width": "2",
    "stroke-linecap": "round",
  },
]);

const WarningIcon: FunctionalComponent = () =>
  h(
    "svg",
    {
      viewBox: "0 0 24 24",
      width: "28",
      height: "28",
      fill: "none",
      "aria-hidden": "true",
      style: { display: "block", flexShrink: "0" },
    },
    [
      h("circle", { cx: "12", cy: "12", r: "12", fill: "#8B5E3C" }),
      h("circle", { cx: "12", cy: "8", r: "1.35", fill: "#fff" }),
      h("path", {
        d: "M12 11.25v6",
        stroke: "#fff",
        "stroke-width": "2.2",
        "stroke-linecap": "round",
      }),
    ],
  );

const InfoIcon = circleIcon("#4864E1", [
  {
    d: "M12 10.5v6.25M12 7.4h.01",
    stroke: "#fff",
    "stroke-width": "2.2",
    "stroke-linecap": "round",
  },
]);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Toastify, {
    autoClose: 5000,
    rtl: true,
    position: "top-left",
    toastClassName: "toast-custom",
    theme: "light",
    transition: "bounce",
  });

  /**
   * Modal dialogs opened with showModal() render in the browser top layer,
   * which sits above any z-index. Promote the toast container into the top
   * layer via the Popover API so toasts stay visible over modals.
   */
  function promoteToastContainer() {
    if (!import.meta.client) return;

    const containers = document.querySelectorAll<HTMLElement>(
      ".Toastify__toast-container",
    );

    containers.forEach((container) => {
      if (typeof container.showPopover !== "function") return;

      if (container.getAttribute("popover") !== "manual") {
        container.setAttribute("popover", "manual");
      }

      try {
        if (!container.matches(":popover-open")) {
          container.showPopover();
        }
      } catch {
        // Older browsers / invalid state — leave normal stacking
      }
    });
  }

  const originalSuccess = toast.success.bind(toast);
  const originalError = toast.error.bind(toast);
  const originalWarning = toast.warning.bind(toast);
  const originalInfo = toast.info?.bind(toast);

  const success: typeof toast.success = (message, options) => {
    const id = originalSuccess(message, {
      ...options,
      icon: SuccessIcon,
      theme: "light",
    });
    queueMicrotask(promoteToastContainer);
    return id;
  };

  const error: typeof toast.error = (message, options) => {
    const id = originalError(message, {
      ...options,
      icon: ErrorIcon,
      theme: "light",
    });
    queueMicrotask(promoteToastContainer);
    return id;
  };

  const warning: typeof toast.warning = (message, options) => {
    const id = originalWarning(message, {
      ...options,
      icon: WarningIcon,
      theme: "light",
    });
    queueMicrotask(promoteToastContainer);
    return id;
  };

  const info: typeof toast.info = (message, options) => {
    const id = originalInfo
      ? originalInfo(message, {
          ...options,
          icon: InfoIcon,
          theme: "light",
        })
      : toast(message, {
          ...options,
          icon: InfoIcon,
          theme: "light",
        });
    queueMicrotask(promoteToastContainer);
    return id;
  };

  return {
    provide: {
      toast: Object.assign(toast, {
        success,
        error,
        warning,
        warn: warning,
        info,
      }),
    },
  };
});
