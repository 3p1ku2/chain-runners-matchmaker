import { utils } from "ethers";

import { ethersProvider } from "../clients";
import { Multicall__factory } from "../../abi-types";
import { MULTICALL_CONTRACT_ADDRESS } from "../config";

type MulticallTuple = [
  contractAddress: string,
  iface: utils.Interface,
  parameters: string[]
];

export async function multicall<T>(calls: MulticallTuple[]): Promise<T[]> {
  if (!MULTICALL_CONTRACT_ADDRESS) {
    throw new Error("No Multicall address was found. Are you sure it is set?");
  }

  try {
    const multicallContract = Multicall__factory.connect(
      MULTICALL_CONTRACT_ADDRESS,
      ethersProvider
    );

    const [_, result] = await multicallContract.callStatic.aggregate(
      calls.map(([address, iface, params]) => ({
        callData: iface.encodeFunctionData(iface.fragments[0].name, params),
        target: address.toLowerCase(),
      }))
    );

    return result.map(
      (r, i) =>
        calls[i][1].decodeFunctionResult(calls[i][1].fragments[0].name, r) as T
    );
  } catch (error) {
    throw error;
  }
}
