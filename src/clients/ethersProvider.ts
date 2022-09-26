import { providers } from "ethers";

/**
 * Ethers Alchemy provider singleton
 */
export const ethersProvider = new providers.StaticJsonRpcProvider(
  "https://eth-mainnet.g.alchemy.com/v2/Xwl1IXr43UCbeGn--7usI7laMFHEDLlq",
  "homestead"
);
