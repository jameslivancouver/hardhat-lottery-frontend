import { useEffect } from "react"
import { useMoralis } from "react-moralis"

export default function ManualButton() {
    const { enableWeb3, isWeb3EnableLoading, isWeb3Enabled, Moralis, account, deactivateWeb3 } =
        useMoralis()

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            if (account === null) {
                window.localStorage.removeItem("provider")
                deactivateWeb3()
            }
        })
    }, [])

    useEffect(() => {
        if (
            !isWeb3Enabled &&
            typeof window !== undefined &&
            window.localStorage.getItem("provider") == "metamask"
        )
            enableWeb3()
    }, [isWeb3Enabled])

    return (
        <nav className="p-5 border-b-2">
            <ul>
                <li className="flex flex-row">
                    {account ? (
                        <div className="py-2 px-4 ml-auto">
                            Connected to {account.slice(0, 6)}...
                            {account.slice(account.length - 4)}
                        </div>
                    ) : (
                        <button
                            onClick={async () => {
                                const ret = await enableWeb3()
                                if (ret !== undefined) {
                                    if (typeof window !== undefined) {
                                        window.localStorage.setItem("provider", "metamask")
                                    }
                                }
                            }}
                            disabled={isWeb3EnableLoading}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 py-4 rounded ml-auto"
                        >
                            Connect
                        </button>
                    )}
                </li>
            </ul>
        </nav>
    )
}
