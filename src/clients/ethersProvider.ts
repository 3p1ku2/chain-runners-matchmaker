import { providers } from "ethers";

import { ALCHEMY_API_KEY } from "../config";

/**
 * Ethers Alchemy provider singleton
 */
export const ethersProvider = new providers.StaticJsonRpcProvider(
  `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  "homestead"
);
