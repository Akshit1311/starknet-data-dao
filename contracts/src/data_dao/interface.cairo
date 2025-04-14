#[starknet::interface]
pub trait  IDataDao<TContractState> {
    fn create_data_req(ref self: TContractState, budget: u256, company_index: u8);
    fn store_user_points(ref self: TContractState, company_id: u8, user_orders: u256, user_points: u256);
}