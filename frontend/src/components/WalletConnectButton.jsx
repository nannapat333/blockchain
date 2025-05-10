import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

export default function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({ connector: new InjectedConnector() });
  const { disconnect } = useDisconnect();

  return isConnected ? (
    <button onClick={() => disconnect()} className="bg-red-500 text-white px-4 py-2 rounded">
      Disconnect ({address.slice(0, 6)}...)
    </button>
  ) : (
    <button onClick={() => connect()} className="bg-green-500 text-white px-4 py-2 rounded">
      Connect Wallet
    </button>
  );
}