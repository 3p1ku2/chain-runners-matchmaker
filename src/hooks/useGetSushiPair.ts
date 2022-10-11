import { useQuery } from "react-query";

import { SUSHISWAP_EXCHANGE_SUBGRAPH_URL } from "../config";

type SushiPairResponse = {
  /**
   * Amount of reserves for `token0` as a float
   */
  reserve0: string;
  /**
   * Amount of reserves for `token1` as a float
   */
  reserve1: string;
  /**
   * Token data for `token0`
   */
  token0: {
    /**
     * Address of `token0`
     */
    id: string;
  };
  /**
   * Token data for `token1`
   */
  token1: {
    /**
     * Address of `token1`
     */
    id: string;
  };
};

type GetSushiPairResult = {
  sushiPair: SushiPairResponse | undefined;
  sushiPairStatus: ReturnType<typeof useQuery>["status"];
};

async function getSushiPair(pairAddress: string): Promise<SushiPairResponse> {
  const payload = {
    query: `query getSushiPair($id: ID!) {
      pair(id: $id) {
        reserve0
        reserve1
        token0 {
          id
        }
        token1 {
          id
        }
      }
    }`,
    variables: {
      id: pairAddress,
    },
  };

  const response = await fetch(SUSHISWAP_EXCHANGE_SUBGRAPH_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Something went wrong while fetching the SushiSwap pair.");
  }

  const responseJSON = await response.json();

  if (responseJSON.errors?.length > 0) {
    throw new Error(
      responseJSON.errors
        .map(({ message }: { message: string }) => message)
        .join("; ")
    );
  }

  return responseJSON.data.pair;
}

export function useGetSushiPair(pairAddress: string): GetSushiPairResult {
  const { data: sushiPair, status: sushiPairStatus } = useQuery(
    ["getSushiPair", pairAddress],
    () => getSushiPair(pairAddress),
    { retry: false }
  );

  return {
    sushiPair,
    sushiPairStatus,
  };
}
