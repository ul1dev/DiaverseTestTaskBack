export const startMessage = () => `<b>Добро пожаловать 👋</b>`;

export const startMarkup = () => ({
  inline_keyboard: [
    [
      {
        text: 'Открыть Mini App',
        web_app: {
          url: process.env.APP_URL,
        },
      },
    ],
  ],
});
