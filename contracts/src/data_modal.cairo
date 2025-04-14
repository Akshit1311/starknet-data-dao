use starknet::ContractAddress;

#[derive(Drop, Copy, Serde, starknet::Store)]
pub struct Settings {
    pub fee_bps: u32,
    pub fee_receiver: ContractAddress,
}

#[derive(Drop, Serde)]
pub struct UserData {
    users: Array<ContractAddress>,
    user_orders: Array<u256>
}
