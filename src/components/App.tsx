import { BigNumber, utils } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useMemo } from "react";

import {
  useGetNFTXVault,
  useGetSudoPair,
  useGetSushiPair,
  useGetUnclaimedXR,
} from "../hooks";
import {
  CHAIN_RUNNERS_XR_CONTRACT_ADDRESS,
  CHAIN_RUNNERS_XR_NFTX_VAULT_ADDRESS,
  CRXRWETH_SUSHI_PAIR_ADDRESS,
} from "../config";
import { CycleEllipsis } from "./CycleEllipsis";

export function App(): JSX.Element {
  /**
   * Our hooks
   */

  const { unclaimed, unclaimedStatus } = useGetUnclaimedXR();
  const { nftxVault } = useGetNFTXVault(CHAIN_RUNNERS_XR_NFTX_VAULT_ADDRESS);
  const { sushiPair } = useGetSushiPair(CRXRWETH_SUSHI_PAIR_ADDRESS);
  const { sudoPair } = useGetSudoPair(CHAIN_RUNNERS_XR_CONTRACT_ADDRESS);

  console.log("---LOG---", sudoPair);

  /**
   * Memoized
   */

  const nftxSingleNFTPrice = useMemo(() => {
    if (!nftxVault || !sushiPair) return;

    const PROTOCOL_FEE: BigNumber = BigNumber.from("3000000000000000");
    const PROTOCOL_FEE_DECIMAL: number = 0.003;
    const { targetRedeemFee } = nftxVault.fees;
    const targetRedeemFeeETH = formatUnits(targetRedeemFee);
    const { reserve0, reserve1, token0 } = sushiPair;
    const targetRedeemFeeWEI: BigNumber = BigNumber.from(targetRedeemFee);

    // Determine NFT reserve
    const nftReserve: BigNumber =
      token0.id.toLowerCase() ===
      CHAIN_RUNNERS_XR_NFTX_VAULT_ADDRESS.toLowerCase()
        ? utils.parseUnits(reserve0)
        : utils.parseUnits(reserve1);

    const remainingNFTReserve = nftReserve.sub(
      utils.parseUnits("1").add(targetRedeemFeeWEI).add(PROTOCOL_FEE)
    );

    return (
      (Number(reserve1) / Number(utils.formatUnits(remainingNFTReserve))) *
      (1 + Number(targetRedeemFeeETH) + PROTOCOL_FEE_DECIMAL)
    );
  }, [nftxVault, sushiPair]);

  /**
   * Render
   */

  return (
    <>
      <div className="flex">
        {/* XR UNCLAIMED COUNT */}
        <p>Unclaimed {Intl.NumberFormat().format(unclaimed?.length || 0)}</p>
        {/* XR UNCLAIMED COUNT PROGRESS */}
        {unclaimedStatus === "loading" && (
          <CycleEllipsis
            ariaLabel="Refreshing unclaimed XR count..."
            intervalMs={300}
          />
        )}
      </div>

      {/* NFTX CRXR PRICE */}
      <p>NFTX CRXR: {nftxSingleNFTPrice}</p>

      {/* SUDOSWAP XR PRICE */}
    </>
  );
}
