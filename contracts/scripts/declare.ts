// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import fs from "fs";
import { json } from "starknet";

import { get_owner, path } from "./helper";

// D:\starkFarm\bankai\contracts\target\dev\bankai_contract_Swap.compiled_contract_class.json
export async function get_contract_class(name: "data_dao") {
	// const contract_path =
	// 	"/Users/hemantwasthere/Desktop/Projects/starknet-data-dao/contracts/target/dev/data_dao_data_dao";
	const contract_path = "./src/target/dev/data_dao_data_dao";

	const Sierra = json.parse(
		fs.readFileSync(`${contract_path}.contract_class.json`).toString("ascii"),
	);
	const Casm = json.parse(
		fs
			.readFileSync(`${contract_path}.compiled_contract_class.json`)
			.toString("ascii"),
	);

	const declareResponse = await get_owner().declareIfNot({
		contract: Sierra,
		casm: Casm,
	});

	return declareResponse.class_hash;
}

(async () => {
	await get_contract_class("data_dao");
})();
