import { useQuery } from "react-query";

import { CHAIN_RUNNERS_XR_CONTRACT_ADDRESS } from "../config";
import { ChainRunnersXR__factory } from "../../abi-types";
import { multicall, UNCLAIMED_XR_TOKEN_IDS_CACHED } from "../helpers";
import { useMemo } from "react";

type GetUnclaimedXRResult = {
  /**
   * Unclaimed Genesis<->XR token IDs
   */
  unclaimed: string[] | undefined;
  unclaimedStatus: ReturnType<typeof useQuery>["status"];
};

const iface = ChainRunnersXR__factory.createInterface();

const multicallCalldata: Parameters<typeof multicall>[0] =
  UNCLAIMED_XR_TOKEN_IDS_CACHED.map((tokenID) => [
    CHAIN_RUNNERS_XR_CONTRACT_ADDRESS,
    iface,
    [tokenID],
  ]);

async function getUnclaimedXR(): Promise<boolean[]> {
  const result = await multicall<boolean>(multicallCalldata);

  const cacheDifference = getUnclaimedCacheDifference(result);

  if (cacheDifference.length > 0) {
    console.log(
      "Remove from cache for claimed:",
      JSON.stringify(getUnclaimedCacheDifference(result), null, 2)
    );
  }

  return result.flatMap((r) => r).filter((r) => r === false);
}

function getUnclaimedCacheDifference(result: boolean[]): string[] {
  return result
    .map((_, i) => UNCLAIMED_XR_TOKEN_IDS_CACHED[i])
    .filter((_, i) => result[i] === true);
}

export function useGetUnclaimedXR(): GetUnclaimedXRResult {
  /**
   * Their hooks
   */

  const { data, status: unclaimedStatus } = useQuery(
    "getUnclaimedXR",
    getUnclaimedXR,
    { retry: false }
  );

  /**
   * Memoized
   */

  const unclaimed = useMemo<string[]>(() => {
    // Return cache
    if (unclaimedStatus !== "success") {
      return UNCLAIMED_XR_TOKEN_IDS_CACHED;
    }

    // Return result
    return UNCLAIMED_XR_TOKEN_IDS_CACHED.filter((_, i) => data?.[i] === false);
  }, [data, unclaimedStatus]);

  /**
   * Return
   */

  return {
    unclaimed,
    unclaimedStatus,
  };
}
