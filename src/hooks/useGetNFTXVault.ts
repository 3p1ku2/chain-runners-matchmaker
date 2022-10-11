import { useQuery } from "react-query";

import { NFTX_SUBGRAPH_URL } from "../config";

type NFTXVaultResponse = {
  fees: {
    /**
     * Fee in WEI to redeem a single, targeted item from the vault
     */
    targetRedeemFee: string;
  };

  holdings: {
    /**
     * Linux timestamp in seconds
     */
    dateAdded: string;
    /**
     * NFT token ID
     */
    tokenId: string;
  }[];
};

type GetNFTXVaultResult = {
  nftxVault: NFTXVaultResponse;
  nftxVaultStatus: ReturnType<typeof useQuery>["status"];
};

async function getNFTXVault(vaultAddress: string): Promise<any> {
  const payload = {
    query: `query getVault($id: ID!) {
      vault(id: $id) {
        fees {
          targetRedeemFee
        }
        holdings {
          dateAdded
          tokenId
        }
      }
    }`,
    variables: {
      id: vaultAddress,
    },
  };

  const response = await fetch(NFTX_SUBGRAPH_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Something went wrong while fetching the NFTX vault.");
  }

  const responseJSON = await response.json();

  if (responseJSON.errors?.length > 0) {
    throw new Error(
      responseJSON.errors
        .map(({ message }: { message: string }) => message)
        .join("; ")
    );
  }

  return responseJSON.data.vault;
}

export function useGetNFTXVault(vaultAddress: string): GetNFTXVaultResult {
  const { data, status: nftxVaultStatus } = useQuery(
    ["getNFTXVault", vaultAddress],
    () => getNFTXVault(vaultAddress),
    { retry: false }
  );

  return {
    nftxVault: data,
    nftxVaultStatus,
  };
}
