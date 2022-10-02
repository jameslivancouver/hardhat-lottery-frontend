import { ConnectButton } from "@web3uikit/web3"

export default function ConnectionButton() {
    return (
        <div className="p-5 border-b-2 flex flex-row">
            <h1 className="px-4 py-4 text-3xl font-bold">Decentralized Lottery</h1>
            <div className="ml-auto px-2 py-4">
                <ConnectButton />
            </div>
        </div>
    )
}
