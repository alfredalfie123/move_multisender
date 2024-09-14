import { useWallet } from "@aptos-labs/wallet-adapter-react";
// Internal Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { AccountInfo } from "@/components/AccountInfo";
import MultiSender from "./components/MultiSender";

function App() {
  const { connected } = useWallet();

  return (
    <>
      <Header />
      <div className="flex items-center justify-center flex-col">
        {connected ? (
          <Card>
            <CardContent className="flex flex-col gap-10 pt-6">
              <AccountInfo />
              {/* <TransferAPT /> */}
              <MultiSender />
            </CardContent>
          </Card>
        ) : (
          <CardHeader>
            <CardTitle>Connect a wallet to perform the multisend action</CardTitle>
          </CardHeader>
        )}
      </div>
    </>
  );
}

export default App;
