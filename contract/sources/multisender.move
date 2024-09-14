module multisender_addr::multisender {
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    const E_EMPTY_RECIPIENTS: u64 = 1;
    const E_MISMATCHED_LENGTHS: u64 = 2;
    const E_ZERO_AMOUNT: u64 = 3;

    public entry fun multi_send<CoinType>(
        sender: &signer,
        recipients: vector<address>,
        amounts: vector<u64>
    ) {
        assert!(!vector::is_empty(&recipients), E_EMPTY_RECIPIENTS);
        assert!(vector::length(&recipients) == vector::length(&amounts), E_MISMATCHED_LENGTHS);

        let recipients_len = vector::length(&recipients);
        let i = 0;
        while (i < recipients_len) {
            let recipient = *vector::borrow(&recipients, i);
            let amount = *vector::borrow(&amounts, i);

            assert!(amount > 0, E_ZERO_AMOUNT);

            coin::transfer<CoinType>(sender, recipient, amount);
            i = i + 1;
        };
    }

    #[test(sender = @0x1, recipient = @0x2)]
    public fun test_multi_send(sender: signer, recipient: signer) {
        use aptos_framework::account;

        // Initialize AptosCoin for testing
        let (burn_cap, mint_cap) = aptos_framework::aptos_coin::initialize_for_test(&sender);

        // Set up accounts
        let sender_addr = account::create_account_for_test(@0x1);
        let recipient_addr = account::create_account_for_test(@0x2);

        // Mint some coins for the sender
        coin::register<AptosCoin>(&sender);
        aptos_framework::aptos_coin::mint(&sender, sender_addr, 1000);

        // Register recipient
        coin::register<AptosCoin>(&recipient);

        // Perform multi-send
        let recipients = vector::empty<address>();
        vector::push_back(&mut recipients, recipient_addr);

        let amounts = vector::empty<u64>();
        vector::push_back(&mut amounts, 500);

        multi_send<AptosCoin>(&sender, recipients, amounts);

        // Assert balances
        assert!(coin::balance<AptosCoin>(sender_addr) == 500, 1000);
        assert!(coin::balance<AptosCoin>(recipient_addr) == 500, 1001);

        // Clean up
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }
}