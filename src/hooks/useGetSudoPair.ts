import { useMemo } from "react";
import { useQuery } from "react-query";

import { SUDOSWAP_SUBGRAPH_URL } from "../config";

type SudoPairResponse = {
  /**
   * Bonding curve contract address
   */
  bondingCurve: string;
  /**
   * Fee in WEI
   */
  fee: string;
  /**
   * ID (bytes32) of pair
   */
  id: string;
  /**
   * List of token IDs
   */
  nftIds: string[];
  /**
   * Base price for a single NFT in WEI.
   */
  spotPrice: string;
};

type GetSudoPairResult = {
  sudoPair: SudoPairResponse[] | undefined;
  sudoPairStatus: ReturnType<typeof useQuery>["status"];
};

async function getSudoPair(
  collectionAddress: string
): Promise<SudoPairResponse[]> {
  const payload = {
    query: `query getSudoPair($id: ID!, $lastID: String) {
      collection(id: $id) {
        pairs(first: 100) {
          bondingCurve
          delta
          fee
          id
          nftIds
          spotPrice
        }
      }
    }`,
    variables: {
      id: collectionAddress,
      lastID: "",
    },
  };

  const response = await fetch(SUDOSWAP_SUBGRAPH_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Something went wrong while fetching the sudoswap pair.");
  }

  const responseJSON = await response.json();

  if (responseJSON.errors?.length > 0) {
    throw new Error(
      responseJSON.errors
        .map(({ message }: { message: string }) => message)
        .join("; ")
    );
  }

  return responseJSON.data.collection.pairs;
}

export function useGetSudoPair(collectionAddress: string): GetSudoPairResult {
  /**
   * Their hooks
   */

  const { data, status: sudoPairStatus } = useQuery(
    ["getSudoPair", collectionAddress],
    () => getSudoPair(collectionAddress),
    { retry: false }
  );

  /**
   * Memoized
   */

  const sudoPair = useMemo<SudoPairResponse[] | undefined>(
    // Take pairs where NFTs are present
    () => data?.filter((d) => d.nftIds.length > 0),
    [data]
  );

  /**
   * Result
   */

  return {
    sudoPair,
    sudoPairStatus,
  };
}
