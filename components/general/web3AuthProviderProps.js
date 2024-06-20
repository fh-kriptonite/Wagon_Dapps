import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { WEB3AUTH_NETWORK } from "@web3auth/base";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
import { chainConfig } from "../../util/chainCofigs"

const clientId = "BF3HLx3QcfPh4g4Kyrx0vmvkB2s2t1tI-FApikT8vk0ERnmtz-XW_AWySynEJEk9FryMrmtWgAjYXGB_I54NSfk";

const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: {
      chainConfig,
    },
});

const web3AuthOptions = {
    clientId: clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    uiConfig: {
      uxMode: "popup",
      appName: "Wagon Network",
      appUrl: "https://wagon.network/",
      logoLight: "https://web3auth.io/images/web3authlog.png",
      logoDark: "https://web3auth.io/images/web3authlogodark.png",
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

  const walletServicesPlugin = new WalletServicesPlugin({
    wsEmbedOpts: {},
    walletInitOptions: { whiteLabel: { showWidgetButton: false } },
  });

export const web3AuthContextConfig = {
    web3AuthOptions,
    adapters: [openloginAdapter],
    plugins: [walletServicesPlugin]
};
