use starknet::ContractAddress;

#[derive(Drop, Copy, Serde, starknet::Store)]
pub struct Settings {
    pub fee_bps: u32,
    pub fee_receiver: ContractAddress,
}

#[derive(Drop, Serde)]
pub struct UserPoints {
    pub user: Array<ContractAddress>,
    pub points: Array<u256> 
}

