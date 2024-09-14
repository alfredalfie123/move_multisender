export const NETWORK = import.meta.env.VITE_APP_NETWORK || "devnet";
export const MODULE_ADDRESS = import.meta.env.VITE_MODULE_ADDRESS || "";
export const CONTRACT_ADDRESS = MODULE_ADDRESS; // Assuming the module is published at the same address
export const MODULE_NAME = import.meta.env.VITE_MODULE_NAME || "multisender";
export const FUNCTION_NAME = "multi_send";
export const COIN_TYPE = "0x1::aptos_coin::AptosCoin";