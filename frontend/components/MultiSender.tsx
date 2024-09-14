import React, { useState, useEffect } from "react";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import { Provider, Network } from "aptos";
import { MODULE_ADDRESS, MODULE_NAME, FUNCTION_NAME, COIN_TYPE, NETWORK } from "../constants";

interface Recipient {
  address: string;
  amount: string;
}

const APT_TO_OCTA = 100_000_000; // 1 APT = 100,000,000 Octas

const MultiSender: React.FC = () => {
  const { account, signAndSubmitTransaction } = useWallet();
  const [recipients, setRecipients] = useState<Recipient[]>([{ address: "", amount: "" }]);
  const [status, setStatus] = useState<string>("");
  const [moduleInfo, setModuleInfo] = useState<string>("Checking module status...");

  useEffect(() => {
    checkModuleStatus();
  }, []);

  const checkModuleStatus = async () => {
    try {
      const provider = new Provider(Network[NETWORK.toUpperCase() as keyof typeof Network]);
      const moduleData = await provider.getAccountModules(MODULE_ADDRESS);
      const multisenderModule = moduleData.find((module) => module.abi?.name === MODULE_NAME);

      if (multisenderModule) {
        setModuleInfo(`Module '${MODULE_NAME}' found at address ${MODULE_ADDRESS}`);
      } else {
        setModuleInfo(
          `Module '${MODULE_NAME}' not found at address ${MODULE_ADDRESS}. Please check your configuration.`,
        );
      }
    } catch (error) {
      setModuleInfo(`Error checking module status: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleAddRecipient = () => {
    setRecipients([...recipients, { address: "", amount: "" }]);
  };

  const handleRemoveRecipient = (index: number) => {
    const newRecipients = recipients.filter((_, i) => i !== index);
    setRecipients(newRecipients);
  };

  const handleInputChange = (index: number, field: keyof Recipient, value: string) => {
    const newRecipients = [...recipients];
    newRecipients[index][field] = value;
    setRecipients(newRecipients);
  };

  const convertAPTtoOcta = (aptAmount: string): string => {
    const floatAmount = parseFloat(aptAmount);
    if (isNaN(floatAmount)) return "0";
    return Math.floor(floatAmount * APT_TO_OCTA).toString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      setStatus("Please connect your wallet first.");
      return;
    }

    try {
      const provider = new Provider(Network[NETWORK.toUpperCase() as keyof typeof Network]);

      const payload: InputTransactionData = {
        data: {
          function: `${MODULE_ADDRESS}::${MODULE_NAME}::${FUNCTION_NAME}`,
          typeArguments: [COIN_TYPE],
          functionArguments: [recipients.map((r) => r.address), recipients.map((r) => convertAPTtoOcta(r.amount))],
        },
      };

      const pendingTransaction = await signAndSubmitTransaction(payload);
      setStatus(`Transaction submitted. Hash: ${pendingTransaction.hash}`);

      await provider.waitForTransaction(pendingTransaction.hash);
      setStatus(`Transaction confirmed!. Hash: ${pendingTransaction.hash}`);
    } catch (error) {
      if (error instanceof Error) {
        setStatus(`Error: ${error.message}`);
      } else {
        setStatus("An unknown error occurred");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">MultiSender</h1>
      <p className="mb-4">Module Address: {MODULE_ADDRESS}</p>
      <p className="mb-4">Module Status: {moduleInfo}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {recipients.map((recipient, index) => (
          <div key={index} className="flex space-x-2">
            <input
              type="text"
              placeholder="Recipient Address"
              value={recipient.address}
              onChange={(e) => handleInputChange(index, "address", e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Amount"
              value={recipient.amount}
              onChange={(e) => handleInputChange(index, "amount", e.target.value)}
              className="w-32 p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => handleRemoveRecipient(index)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddRecipient}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Recipient
        </button>
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Send
        </button>
      </form>
      {status && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <p>{status}</p>
        </div>
      )}
    </div>
  );
};

export default MultiSender;
