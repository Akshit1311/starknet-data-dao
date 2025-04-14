#[starknet::contract]
mod data_dao {
    use OwnableComponent::InternalTrait;
    use starknet::event::EventEmitter;
    use starknet::storage::StorageMapReadAccess;
    use starknet::{ContractAddress, get_caller_address, get_contract_address, ClassHash};
    use starknet::storage::Map;
    use data_dao::utils::ERC20Helper;
    use openzeppelin_security::reentrancyguard::{ReentrancyGuardComponent };
    use openzeppelin_access::ownable::ownable::OwnableComponent;
    use openzeppelin_upgrades::upgradeable::UpgradeableComponent;
    use data_dao::data_dao::interface::IDataDao;
    use starknet::storage::StorageMapWriteAccess;
    use data_dao::data_modal::{Settings, UserPoints};
    use starknet::storage::{ StoragePointerReadAccess, StoragePointerWriteAccess};
    use data_dao::data_dao::IReclaim::{Proof, IReclaimDispatcher, IReclaimDispatcherTrait};

    component!(path: ReentrancyGuardComponent, storage: reng, event: ReentrancyGuardEvent);
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: UpgradeableComponent, storage: upgradeable, event: UpgradeableEvent);

    #[abi(embed_v0)]
    impl OwnableTwoStepImpl = OwnableComponent::OwnableTwoStepImpl<ContractState>;

    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;
    impl ReentrancyGuardInternalImpl = ReentrancyGuardComponent::InternalImpl<ContractState>;
    impl UpgradeableInternalImpl = UpgradeableComponent::InternalImpl<ContractState>;
  
    #[derive(Drop, starknet::Event)]
    struct DataRequested {
        #[key]
        budget: u256,
        #[key]
        company_index: u8,
        #[key]
        buyer: ContractAddress
    }

    #[derive(Drop, starknet::Event)]
    struct DataCollected {
        #[key]
        user: ContractAddress,
        #[key]
        user_orders: u256,
        #[key]
        company_index: u8,
        #[key]
        user_points: u256
    }

    #[storage]
    struct Storage {
        #[substorage(v0)]
        reng: ReentrancyGuardComponent::Storage,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        upgradeable: UpgradeableComponent::Storage,

        settings: Settings,
        reclaim: ContractAddress,
        budget_token: ContractAddress,
        user_data: Map::<(ContractAddress, u8), u256>,
        user_index: Map::<u8, u256>,  
        users: Map::<(u8, u256), ContractAddress>,
        user_orders: Map::<(u8, u256), u256>,
        user_points: Map::<(u8, u256), u256>
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ReentrancyGuardEvent: ReentrancyGuardComponent::Event,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        UpgradeableEvent: UpgradeableComponent::Event,
        DataRequested: DataRequested,
        DataCollected: DataCollected
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        settings: Settings,
        budget_token: ContractAddress,
        reclaim: ContractAddress,
        owner: ContractAddress
    ) {
        self.settings.write(settings);
        self.budget_token.write(budget_token);
        self.reclaim.write(reclaim);
        self.ownable.initializer(owner);
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
            self.reng.start();
            let buyer = get_caller_address();
            assert(budget > 0, 'budget cannot be zero');
            // transfer amount from caller
            self._transfer_budget_with_fee(buyer, budget);
            // transfer remaining budget to users 
            self._transfer_budget_to_users(budget, company_index);
            self.reng.end();
            // emit event
            self
                .emit(
                    DataRequested{
                        budget,
                        company_index,
                        buyer 
                    }
                );
        }

        fn store_user_points(
            ref self: ContractState,
            company_index: u8,
            user_orders: u256,
            user_points: u256,
            proof: Proof
        ) {
            // proof 
            // reclaim.verify_proof(proof)
            // assert true 
            // run the fn 
            // or break
            self.reng.start();
            let isVerified = self._verify_reclaim_proof(proof);
            assert(isVerified == true, 'proof not verified');
            let user = get_caller_address();
            self.store_user_data(company_index, user_orders, user_points, user);
            self.reng.end();
            self
                .emit(
                    DataCollected{
                        user,
                        user_orders,
                        company_index,
                        user_points
                    }
                )
        }

        fn get_user_points(
            self: @ContractState, 
            company_id: u8, 
        ) -> UserPoints {
            let mut points = ArrayTrait::<u256>::new();
            let mut users = ArrayTrait::<ContractAddress>::new();
            let mut user_points = UserPoints {
                user: users,
                points: points
            };
            let curr_index = self.user_index.read(company_id);
            let i = 0;
            while i == curr_index {
                let curr_user = self.users.read((company_id, i));
                let curr_points = self.user_points.read((company_id, i));
                user_points.user.append(curr_user);
                user_points.points.append(curr_points);
            }

            return user_points;
        }

        fn upgrade(ref self: ContractState, class_hash: ClassHash) {
            self.ownable.assert_only_owner();
            self.upgradeable.upgrade(class_hash);
        }
    }

    #[generate_trait]
    pub impl InternalImpl of InternalDaoTrait {
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

        fn _verify_reclaim_proof(ref self: ContractState, proof: Proof) -> bool{
            let reclaim_address = self.reclaim.read();
            IReclaimDispatcher {contract_address: reclaim_address}.verify_proof(proof);
            return true;
        }

        fn _transfer_budget_to_users(
            ref self: ContractState,
            budget: u256,
            company_index: u8
        ) {
            let total_users = self.user_index.read(company_index);
            let mut i = 0;
            while i == total_users {
                let user = self.users.read((company_index, i));
                let user_points = self.user_points.read((company_index, i));
                let reward_amount = user_points * budget;
                ERC20Helper::transfer(self.budget_token.read(), user, reward_amount);
            }
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