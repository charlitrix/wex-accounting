import { boot } from "quasar/wrappers";
import { Notify } from "quasar";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }) => {
  app.mixin({
    methods: {
      displayNotification(message, color, position = "center") {
        Notify.create({
          message: message,
          color: color,
          position: position,
          multiLine: true,
          actions: [{ label: "Dismiss", color: "white", handler: () => {} }],
        });
      },
      formatPrice(price, currency = "Ugx") {
        return `${price
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${currency}`;
      },
    },
  });
});
