#[starknet::contract]
mod data_dao {
    use starknet::storage::StorageMapReadAccess;
    use starknet::{ContractAddress, get_caller_address, get_contract_address};
    use starknet::storage::Map;
    use data_dao::utils::ERC20Helper;
    use data_dao::data_dao::interface::IDataDao;
    use starknet::storage::StorageMapWriteAccess;
    use data_dao::data_modal::{Settings, UserData};
    use data_dao::utils::Math;
    use starknet::storage::{ StoragePointerReadAccess, StoragePointerWriteAccess};
  
    #[storage]
    #[allow(starknet::invalid_storage_member_types)]
    struct Storage {
        settings: Settings,
        budget_token: ContractAddress,
        user_data: Map::<(ContractAddress, u8), u256>,
        user_index: Map::<u8, u256>,  
        users: Map::<(u8, u256), ContractAddress>,
        user_orders: Map::<(u8, u256), u256>,
        user_points: Map::<(u8, u256), u256>
    }

    #[derive(Drop, starknet::Event)]
    struct DataRequested {
        // #[key]
        // pool_id: felt252,
        // #[key]
        // extension: ContractAddress,
        // #[key]
        // creator: ContractAddress
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        settings: Settings,
        budget_token: ContractAddress,
    ) {
        self.settings.write(settings);
        self.budget_token.write(budget_token);
        let mut i = 0;
        while(i == 10) {
            self.user_index.write(i, 0);
            i += 1;
        }
    }

    #[abi(embed_v0)]
    impl ExternalImpl of IDataDao<ContractState> {
        fn create_data_req(
            ref self: ContractState,
            budget: u256, 
            company_index: u8
        ) {
            let caller = get_caller_address();
            assert(budget > 0, 'budget cannot be zero');
            // transfer amount from caller
            self._transfer_budget_with_fee(caller, budget);
            // transfer remaining budget to users 
            self._transfer_budget_to_users(budget);
        }

        fn store_user_points(
            ref self: ContractState,
            company_id: u8,
            user_orders: u256,
            user_points: u256
        ) {
            let caller = get_caller_address();
            self.store_user_data(company_id, user_orders, user_points, caller,);
        }
    }

    #[generate_trait]
    pub impl InternalImpl of InternalTrait {
        fn _transfer_budget_with_fee(
            ref self: ContractState,
            caller: ContractAddress,
            budget: u256
        ) {
            let budget_token = self.budget_token.read();
            let this = get_contract_address();
            ERC20Helper::approve(budget_token, this, budget);
            ERC20Helper::transfer_from(budget_token, get_caller_address(), this, budget);
            let settings = self.settings.read();
            let protocol_fee = (settings.fee_bps * budget.try_into().unwrap()) / 10000;
            ERC20Helper::transfer(budget_token, settings.fee_receiver, protocol_fee.into());
        }

        fn _transfer_budget_to_users(
            ref self: ContractState,
            budget: u256,
        ) {
            
        }

        fn store_user_data(
            ref self: ContractState, 
            company_id: u8, 
            user_orders: u256,
            user_points: u256,
            user: ContractAddress
        ) {
            let curr_index = self.user_index.read(company_id);
            self.users.write((company_id, curr_index), user);
            self.user_orders.write((company_id, curr_index), user_orders);
            self.user_points.write((company_id, curr_index), user_points);
            self.user_index.write(company_id, (curr_index + 1));
        }
    }
}