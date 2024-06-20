import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
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
      loginMethodsOrder: ["google", "apple", "twitter"],
      appUrl: "https://app.wagon.network/",
      logoLight: "https://app.wagon.network/logo.png",
      logoDark: "https://app.wagon.network/logo.png",
      defaultLanguage: "en", // en, de, ja, ko, zh, es, fr, pt, nl, tr
      mode: "light", // whether to enable dark mode. defaultValue: auto
      primaryButton: "socialLogin",
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

  const walletServicesPlugin = new WalletServicesPlugin({
    wsEmbedOpts: {},
    walletInitOptions: { whiteLabel: { showWidgetButton: false } },
  });

export const web3AuthContextConfig = {
    web3AuthOptions,
    adapters: [openloginAdapter],
    plugins: [walletServicesPlugin]
};
