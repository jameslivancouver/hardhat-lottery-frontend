// 1, Enter raffle upon click,  participate the lotto
// 2, Get the info of entrance fee, player and winner
// 3, Once the WinnerPicked event fired, automatically update the UI ...

// Sidenote: From the backend,   manually kick off the lottery draw

import { useWeb3Contract, useMoralis } from "react-moralis"
// import { useChain } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useState, useEffect } from "react"
import { useNotification } from "@web3uikit/core"
import { ethers } from "ethers"

const LotteryDraw = () => {
    const [entranceFee, setEntranceFee] = useState(0)
    const [NumberOfPlayers, setNumberOfPlayers] = useState(0)
    const [Winner, setWinner] = useState(0)
    const { web3, isWeb3Enabled, chainId } = useMoralis()
    const raffleAddress =
        parseInt(chainId).toString() in contractAddress
            ? contractAddress[parseInt(chainId).toString()][0]
            : null

    // const { chainId } = useChain()
    // console.log(contractAddress[parseInt(chainId)][0])
    const {
        data,
        error,
        runContractFunction: enterRaffle,
        isFetching,
        isLoading,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })
    const { runContractFunction: getWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getWinner",
        params: {},
    })
    const { runContractFunction: getMinEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getMinEntranceFee",
        params: {},
    })

    const dispatch = useNotification()

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Successfully Complete",
            title: "Transaction Notification",
            position: "topR",
        })
    }

    const updateUI = async () => {
        entranceFee = (await getMinEntranceFee()).toString()
        // entranceFee = await getMinEntranceFee()
        setEntranceFee(entranceFee)
        NumberOfPlayers = (await getNumberOfPlayers()).toString()
        // NumberOfPlayers = await getNumberOfPlayers()
        setNumberOfPlayers(NumberOfPlayers)
        Winner = await getWinner()
        setWinner(Winner)
    }

    const winnerPickedListener = async () => {
        let raffleContract = new ethers.Contract(raffleAddress, abi, web3)
        raffleContract.on("WinnerPicked", () => {
            try {
                updateUI()
            } catch (e) {
                console.log(e)
            }
        })
    }

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification()
        updateUI()
    }

    useEffect(() => {
        if (raffleAddress) {
            if (isWeb3Enabled) {
                updateUI()
                winnerPickedListener()
            } else {
                let raffleContract = new ethers.Contract(raffleAddress, abi, web3)
                raffleContract.off("WinnerPicked")
            }
        }
    }, [isWeb3Enabled, raffleAddress])

    return (
        <div className="p-5">
            <h1 className="px-4 py-4 text-3xl font-bold">Lottery</h1>
            {raffleAddress ? (
                <>
                    <button
                        onClick={async () => {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => {
                                    console.log(error)
                                },
                            })
                        }}
                        disabled={isFetching || isLoading}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 py-4 mr-auto rounded "
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin max-w-fit max-h-fit border-0 rounded-full">
                                Loading...
                            </div>
                        ) : (
                            " enter Raffle"
                        )}
                    </button>
                    <div>
                        Raffle Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")}ETH
                    </div>
                    <div>Number Of Players: {NumberOfPlayers}</div>
                    <div>Winner of Last Draw: {Winner}</div>
                </>
            ) : (
                <div>
                    The chain you are tying to connect is not deployed yet , please try again
                    later.
                </div>
            )}
        </div>
    )
}

export default LotteryDraw
