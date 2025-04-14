use starknet::{ClassHash, ContractAddress};
use data_dao::data_modal::UserPoints;
use data_dao::data_dao::IReclaim::Proof;

#[starknet::interface]
pub trait  IDataDao<TContractState> {
    fn create_data_req(ref self: TContractState, budget: u256, company_index: u8);
    fn store_user_points(ref self: TContractState, company_index: u8, user_orders: u256, user_points: u256, proof: Proof);
    fn upgrade(ref self: TContractState, class_hash: ClassHash);
    // user list which returns points for a particular company 
    fn get_user_points(self: @TContractState, company_id: u8) -> UserPoints;
}