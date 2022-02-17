import { useState, useEffect } from 'react'
import Head from 'next/head'
import Web3 from 'web3'
import wethTokenContract from '../blockchain/wethToken'
import usdcTokenContract from '../blockchain/usdcToken'
import styles from '../styles/Home.module.css'
import 'bulma/css/bulma.css'

export default function Home() {
  const [web3, setWeb3] = useState()
  const [address, setAddress] = useState()
  const [wethDepositAmount, setWethDepositAmount] = useState()
  const [usdcDepositAmount, setUsdcDepositAmount] = useState()
  const [wethContract, setWethContract] = useState()
  const [usdcContract, setUsdcContract] = useState()
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_CONTRACT_ADDRESS

  useEffect(() => {
    updateState()
  }, [wethContract, usdcContract])

  const updateState = () => {
  }

  const wethDepositAmountHandler = event => {
    console.log(event.target.value)
    setWethDepositAmount(event.target.value)
  }

  const usdcDepositAmountHandler = event => {
    setUsdcDepositAmount(event.target.value)
  }

  const approveDepositHandler = async token => {
    setError('')
    setSuccessMsg('')
    let resp;
    try {
      if (token === 'weth') {
        resp = await wethContract.methods.approve(treasuryAddress, wethDepositAmount).send({
          from: address,
          gas: 300000,
          gasPrice: null
        })
      }

      if (token === 'usdc') {
        resp = await usdcContract.methods.approve(treasuryAddress, usdcDepositAmount).send({
          from: address,
          gas: 300000,
          gasPrice: null
        })
      }
      
      setSuccessMsg(`Approval succeeded: ${resp}`)
    } catch(err) {
      setError(err.message)
    }
  }

  const getAllowanceHandler = async token => {
    setError('')
    setSuccessMsg('')
    let allowance
    try {
      if (token === 'weth') allowance = await wethContract.methods.allowance(address, treasuryAddress).call()
      if (token === 'usdc') allowance = await usdcContract.methods.allowance(address, treasuryAddress).call()
      setSuccessMsg(`Allowance is: ${allowance}`)
    } catch(err) {
      setError(err.message)
    }
  }

  const connectWalletHandler = async () => {
    setError('')
    setSuccessMsg('')
    /* check if MetaMask is installed */
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        /* request wallet connection */
        await window.ethereum.request({ method: "eth_requestAccounts"})
        /* create web3 instance & set to state */
        const web3 = new Web3(window.ethereum)
        /* set web3 instance in React state */
        setWeb3(web3)
        /* get list of accounts */
        const accounts = await web3.eth.getAccounts()
        /* set account 1 to React state */
        setAddress(accounts[0])

        /* create local contract copies */
        const wethContract = wethTokenContract(web3)
        setWethContract(wethContract)

        const usdcContract = usdcTokenContract(web3)
        setUsdcContract(usdcContract)

        window.ethereum.on('accountsChanged', async () => {
          const accounts = await web3.eth.getAccounts()
          console.log(accounts[0])
          /* set account 1 to React state */
          setAddress(accounts[0])
        })
      } catch(err) {
        setError(err.message)
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask")
    }
  }


  return (
    <div>
      <Head>
        <title>Treasury dApp</title>
        <meta name="description" content="A Treasury dApp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <nav className="navbar mt-4 mb-4">
          <div className="container">
            <div className="navbar-brand">
              <h1>Treasury dApp</h1>
            </div>
            <div className="navbar-end">
              <button onClick={connectWalletHandler} className="button is-link">Connect Wallet</button>
            </div>
          </div>
        </nav>
        <div className="container">
          <section className="mt-5">
            <div className="columns">
              <div className="column is-two-thirds">
                <section className="mt-5">
                  <p>Approve treasury WETH deposit:</p>
                  <div className="field">
                    <div className="control">
                      <input onChange={wethDepositAmountHandler} className="input" type="text" placeholder="Approval amount" />
                    </div>
                  </div>
                  <button onClick={() => approveDepositHandler('weth')} className="button is-primary is-large is-light mt-3">Pre-approve WETH deposit</button>
                </section>
                <section className="mt-5">
                  <p>Get treasury deposit allowance:</p>
                  <button onClick={() => getAllowanceHandler('weth')} className="button is-link is-large is-light mt-3">Get WETH allowance</button>
                </section>
              </div>
              <div className="column is-one-third"></div>
            </div>
          </section>
          <section className="mt-5">
            <div className="columns">
              <div className="column is-two-thirds">
                <section className="mt-5">
                  <p>Approve treasury USDC deposit:</p>
                  <div className="field">
                    <div className="control">
                      <input onChange={usdcDepositAmountHandler} className="input" type="text" placeholder="Approval amount"  />
                    </div>
                  </div>
                  <button onClick={() => approveDepositHandler('usdc')} className="button is-primary is-large is-light mt-3">Pre-approve USDC deposit</button>
                </section>
                <section className="mt-5">
                  <p>Get treasury deposit allowance:</p>
                  <button onClick={() => getAllowanceHandler('usdc')} className="button is-link is-large is-light mt-3">Get USDC allowance</button>
                </section>
              </div>
              <div className="column is-one-third"></div>
            </div>
          </section>
          <section>
            <div className="container has-text-danger mt-6">
              <p>{error}</p>
            </div>
            <div className="container has-text-success mt-6">
              <p>{successMsg}</p>
            </div>
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2022 Block Explorer</p>
      </footer>
    </div>
  )
}