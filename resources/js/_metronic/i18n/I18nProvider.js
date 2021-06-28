import React from "react";
import {useLang} from "./Metronici18n";
import {IntlProvider} from "react-intl";
import "@formatjs/intl-displaynames/polyfill";
import "@formatjs/intl-displaynames/locale-data/en";
import "@formatjs/intl-displaynames/locale-data/de";
import "@formatjs/intl-displaynames/locale-data/es";
import "@formatjs/intl-displaynames/locale-data/fr";
import "@formatjs/intl-displaynames/locale-data/ja";
import "@formatjs/intl-displaynames/locale-data/zh";

import deMessages from "./messages/de";
import enMessages from "./messages/en";
import esMessages from "./messages/es";
import frMessages from "./messages/fr";
import jaMessages from "./messages/ja";
import zhMessages from "./messages/zh";

const allMessages = {
  de: deMessages,
  en: enMessages,
  es: esMessages,
  fr: frMessages,
  ja: jaMessages,
  zh: zhMessages
};

export function I18nProvider({ children }) {
  const locale = useLang();
  const messages = allMessages[locale];

  return (
    <IntlProvider locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
}
