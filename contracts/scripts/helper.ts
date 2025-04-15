// import dotenv from "dotenv";
// import { Account, Contract, RpcProvider } from "starknet";

// // export const path = `${__dirname}../.env.local`;
// export const path =
// 	"/Users/hemantwasthere/Desktop/Projects/starknet-data-dao/contracts/.env.local";

// dotenv.config();

// export const sepoliaRpc = process.env.SEPOLIA_RPC as string;

// export const provider = new RpcProvider({
// 	nodeUrl:
// 		"https://rpc.nethermind.io/mainnet-juno/?apikey=MoT3KCYhIqIWHlzfctLdXpZ24l9iDtZQzHHlG12lRMvkxumhu577u1urHvFhSABX",
// });

// // biome-ignore lint/suspicious/noExplicitAny: <explanation>
// export const owner_private_key: any =
// 	"0x0429b4b10e29084fa119d8720c63dd977b873bcdaad4b9235d1f682cc3cf4f18";
// export const owner_account_address =
// 	"0x06bcfc16a27d3169fd0ee0412285ea2d3e249b56e129617cc63cec0938838dde";

// // export async function get_contract_instance(
// // 	name: "PROJECTNFT" | "STAKING" | "CONTRIBUTORSBT",
// // ) {
// // 	const contract_address =
// // 		name === "STAKING"
// // 			? (process.env.STAKING_CONTRACT_ADDRESS as string)
// // 			: name === "PROJECTNFT"
// // 				? (process.env.PROJECTNFT_CONTRACT_ADDRESS as string)
// // 				: (process.env.CONTRIBUTORSBT_CONTRACT_ADDRESS as string);
// // 	const { abi: Abi } = await provider.getClassAt(contract_address);
// // 	if (Abi === undefined) {
// // 		throw new Error("no abi.");
// // 	}

// // 	return new Contract(Abi, contract_address, provider);
// // }

// export function get_owner() {
// 	return new Account(provider, owner_account_address, owner_private_key, "1");
// }

import dotenv from "dotenv";
import { Account, Contract, RpcProvider } from "starknet";

export const path = __dirname + "/../.env.local";

dotenv.config({ path: path });

export const sepoliaRpc = process.env.SEPOLIA_RPC as string;

export const provider = new RpcProvider({ nodeUrl: sepoliaRpc });

export const owner_private_key: any = process.env.PRIVATE_KEY as string;
export const owner_account_address = process.env.ACCOUNT_ADDRESS as string;

export async function get_contract_instance(
	name: "PROJECTNFT" | "STAKING" | "CONTRIBUTORSBT",
) {
	const contract_address =
		name === "STAKING"
			? (process.env.STAKING_CONTRACT_ADDRESS as string)
			: name === "PROJECTNFT"
				? (process.env.PROJECTNFT_CONTRACT_ADDRESS as string)
				: (process.env.CONTRIBUTORSBT_CONTRACT_ADDRESS as string);
	const { abi: Abi } = await provider.getClassAt(contract_address);
	if (Abi === undefined) {
		throw new Error("no abi.");
	}

	return new Contract(Abi, contract_address, provider);
}

export function get_owner() {
	return new Account(provider, owner_account_address, owner_private_key, "1");
}
