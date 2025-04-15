// import { byteArray, CallData, uint256 } from "starknet";

// import { get_owner, owner_account_address, path, provider } from "./helper";

// async function get_callData(name: "data_dao") {
// 	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
// 	let data: any;
// 	if (name === "data_dao") {
// 		data = {
// 			settings: {
// 				fee_bps: 1000,
// 				fee_receiver: owner_account_address,
// 			},
// 			budget_token:
// 				"0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
// 			reclaim:
// 				"0x0765f3f940f7c59288b522a44ac0eeba82f8bf71dd03e265d2c9ba3521466b4e",
// 			owner: owner_account_address,
// 		};
// 	}
// 	return data;
// }

// async function deployContract(name: "data_dao") {
// 	const class_hash =
// 		"0x3fd56535cb4f9875f03a4954f3769fd98afc88167369af17347bc71e269d855";
// 	const { transaction_hash, contract_address } = await get_owner().deploy({
// 		classHash: class_hash,
// 		constructorCalldata: await get_callData(name),
// 	});
// 	await provider.waitForTransaction(transaction_hash);
// 	const [contractAddress] = contract_address;

// 	console.log(`✅ ${name} contract deployed at = "${contractAddress}"`);
// }

// if (require.main === module) {
// 	deployContract("data_dao");
// }

import { byteArray, CallData, uint256 } from "starknet";
import { get_owner, owner_account_address, path, provider } from "./helper";

async function get_callData(name: "data_dao") {
	let data: any;
	if (name === "data_dao") {
		data = {
			vault: process.env.VAULT_ADDRESS,
		};
	}
	return data;
}

async function deployContract(name: "data_dao") {
	const class_hash =
		"0x78c34f89b58fb3e795cc0035d174832307aa10d38cd1249dde709bdecdd0381";
	const { transaction_hash, contract_address } = await get_owner().deploy({
		classHash: class_hash,
		constructorCalldata: await get_callData(name),
	});
	await provider.waitForTransaction(transaction_hash);
	const [contractAddress] = contract_address;

	console.log(`✅ ${name} contract deployed at = "${contractAddress}"`);
}

if (require.main === module) {
	deployContract("data_dao");
}
