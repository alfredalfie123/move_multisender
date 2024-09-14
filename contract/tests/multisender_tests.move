#[test_only]
module multisender_addr::multisender_tests {
    use std::signer;
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::account;
    use multisender_addr::multisender;

    #[test(sender = @multisender_addr, recipient1 = @0x2, recipient2 = @0x3)]
    fun test_multi_send(
        sender: signer,
        recipient1: signer,
        recipient2: signer
    ) {
        let sender_addr = signer::address_of(&sender);
        let recipient1_addr = signer::address_of(&recipient1);
        let recipient2_addr = signer::address_of(&recipient2);

        // Create test accounts
        account::create_account_for_test(sender_addr);
        account::create_account_for_test(recipient1_addr);
        account::create_account_for_test(recipient2_addr);

        // Initialize AptosCoin for testing
        let (burn_cap, mint_cap) = aptos_framework::aptos_coin::initialize_for_test(&sender);

        // Mint some coins for the sender
        coin::register<AptosCoin>(&sender);
        aptos_framework::aptos_coin::mint(&sender, sender_addr, 1000);

        // Register recipients
        coin::register<AptosCoin>(&recipient1);
        coin::register<AptosCoin>(&recipient2);

        // Initialize event store
        multisender::init_event_store_for_test(&sender);

        // Perform multi-send
        let recipients = vector::empty<address>();
        vector::push_back(&mut recipients, recipient1_addr);
        vector::push_back(&mut recipients, recipient2_addr);

        let amounts = vector::empty<u64>();
        vector::push_back(&mut amounts, 300);
        vector::push_back(&mut amounts, 200);

        multisender::multi_send<AptosCoin>(&sender, recipients, amounts);

        // Assert balances
        assert!(coin::balance<AptosCoin>(sender_addr) == 500, 2000);
        assert!(coin::balance<AptosCoin>(recipient1_addr) == 300, 2001);
        assert!(coin::balance<AptosCoin>(recipient2_addr) == 200, 2002);

        // Clean up
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }
}