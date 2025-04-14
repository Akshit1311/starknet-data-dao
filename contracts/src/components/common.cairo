#[starknet::component]
pub mod CommonComp {
    use openzeppelin_upgrades::UpgradeableComponent;
    use openzeppelin_upgrades::UpgradeableComponent::InternalTrait as UpgradeableInternalTrait;
    use openzeppelin_access::ownable::OwnableComponent;
    use openzeppelin_access::ownable::OwnableComponent::{
        InternalTrait as OwnableInternalTrait,
    };
    use openzeppelin_security::pausable::{PausableComponent};
    use openzeppelin_security::pausable::PausableComponent::{
        InternalTrait as PausableInternalTrait,
        PausableImpl
    };
    use openzeppelin_security::reentrancyguard::ReentrancyGuardComponent;
    use openzeppelin_security::reentrancyguard::ReentrancyGuardComponent::{
        InternalTrait as ReentrancyGuardInternalTrait,
    };

    use data_dao::components::ICommon;
    use starknet::{ClassHash, ContractAddress};

    #[storage]
    struct Storage {}

    #[embeddable_as(CommonImpl)]
    impl Common<
        TContractState,
        +HasComponent<TContractState>,
        impl Upgradeable: UpgradeableComponent::HasComponent<TContractState>,
        impl Ownable: OwnableComponent::HasComponent<TContractState>,
        impl Pausable: PausableComponent::HasComponent<TContractState>,
        impl ReentrancyGuard: ReentrancyGuardComponent::HasComponent<TContractState>,
        +Drop<TContractState>
    > of ICommon<ComponentState<TContractState>> {
        fn upgrade(ref self: ComponentState<TContractState>, new_class: ClassHash) {
            self.assert_only_owner();
            let mut upgradeable = get_dep_component_mut!(ref self, Upgradeable);
            upgradeable._upgrade(new_class);
        }

        fn pause(ref self: ComponentState<TContractState>) {
            self.assert_only_owner();
            let mut pausable = get_dep_component_mut!(ref self, Pausable);
            pausable._pause();
        }

        fn unpause(ref self: ComponentState<TContractState>) {
            self.assert_only_owner();
            let mut pausable = get_dep_component_mut!(ref self, Pausable);
            pausable._unpause();
        }

        fn is_paused(self: @ComponentState<TContractState>) -> bool {
            let pausable = get_dep_component!(self, Pausable);
            pausable.is_paused()
        }

        // for easy of importing impls, adding ownable stuff here
        // instead of importing from oz
        fn owner(self: @ComponentState<TContractState>) -> ContractAddress {
            let ownable = get_dep_component!(self, Ownable);
            ownable.owner()
        }

        fn transfer_ownership(
            ref self: ComponentState<TContractState>,
            new_owner: ContractAddress
        ) {
            let mut ownable = get_dep_component_mut!(ref self, Ownable);
            ownable.transfer_ownership(new_owner);
        }

        fn renounce_ownership(ref self: ComponentState<TContractState>) {
            let mut ownable = get_dep_component_mut!(ref self, Ownable);
            ownable.renounce_ownership();
        }
    }

    #[generate_trait]
    pub impl InternalImpl<
        TContractState,
        +HasComponent<TContractState>,
        impl Upgradeable: UpgradeableComponent::HasComponent<TContractState>,
        impl Ownable: OwnableComponent::HasComponent<TContractState>,
        impl Pausable: PausableComponent::HasComponent<TContractState>,
        impl ReentrancyGuard: ReentrancyGuardComponent::HasComponent<TContractState>,
        +Drop<TContractState>
    > of InternalTrait<TContractState> {
        fn initializer(ref self: ComponentState<TContractState>, owner: ContractAddress) {
            let mut ownable = get_dep_component_mut!(ref self, Ownable);
            ownable.initializer(owner);
        }

        fn assert_only_owner(self: @ComponentState<TContractState>) {
            let ownable = get_dep_component!(self, Ownable);
            ownable.assert_only_owner();
        }
    }
}