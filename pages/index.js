import Head from "next/head"
import styles from "../styles/Home.module.css"
// import ConnectionButton from "../components/ConnectionButton"
import ManualButton from "../components/ManualButton"
import LotteryDraw from "../components/LotteryDraw"
import { useMoralis } from "react-moralis"
import { contractAddress } from "../constants"

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()
    console.log(chainId)
    const supportedChains = ["31337", "5"]
    return (
        <div className={styles.container}>
            <Head>
                <title>Lottery App</title>
                <meta
                    name="description"
                    content="Lottery App powered by nextjs,moralis, web3uikit"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* <ConnectionButton /> */}
            <ManualButton />
            {/* supportedChains.includes(parseInt(chainId).toString()) */}
            {isWeb3Enabled ? (
                <div>
                    {parseInt(chainId).toString() in contractAddress ? (
                        <div>
                            <LotteryDraw />
                        </div>
                    ) : (
                        <div>
                            {`Please switch to a supported chainId, supported ChainIds are: ${supportedChains}`}
                        </div>
                    )}
                </div>
            ) : (
                <div>Please connect to a wallet</div>
            )}
        </div>
    )
}
