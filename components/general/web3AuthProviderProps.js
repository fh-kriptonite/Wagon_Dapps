import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { chainConfig } from "../../util/chainCofigs"

const clientId = process.env.WEB3AUTH_CLIENT_ID;

const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: {
      chainConfig,
    },
});

const web3AuthOptions = {
    clientId: clientId,
    web3AuthNetwork: process.env.WEB3AUTH_NETWORK,
    uiConfig: {
      uxMode: "popup",
      appName: "Wagon Network",
      appUrl: "https://app.wagon.network/",
      logoLight: "https://app.wagon.network/logo.png",
      logoDark: "https://app.wagon.network/logo.png",
      defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl, tr
      mode: "light", // whether to enable dark mode. defaultValue: auto
      useLogoLoader: true,
    },
    privateKeyProvider: privateKeyProvider,
  };

  const openloginAdapter = new OpenloginAdapter({
    loginSettings: {
      mfaLevel: "none"
    },
    adapterSettings: {
      uxMode: "popup", // "redirect" | "popup"
    },
  });

export const web3AuthContextConfig = {
    web3AuthOptions,
    adapters: [openloginAdapter],
    plugins: []
};
