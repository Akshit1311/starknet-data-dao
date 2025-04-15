import { provider, get_owner, owner_account_address,  path } from "./helper";
import { byteArray, uint256, CallData } from "starknet";

async function get_callData(name: 'data_dao') {
  let data: any;
    if (name === 'data_dao') {
    data = {
      vault: process.env.VAULT_ADDRESS
    };
  }
  return data;
}

async function deployContract(name: 'data_dao') {
  const class_hash = '0x78c34f89b58fb3e795cc0035d174832307aa10d38cd1249dde709bdecdd0381';
  const { transaction_hash, contract_address } = await get_owner().deploy({
    classHash: class_hash,
    constructorCalldata: await get_callData(name)
  });
  await provider.waitForTransaction(transaction_hash);
  const [contractAddress] = contract_address;

  console.log(
    `✅ ${name} contract deployed at = "${contractAddress}"`
  );
}

if (require.main === module) {
  deployContract('data_dao');
}