import { useState, useEffect } from 'react'
import Web3 from 'web3'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import 'bulma/css/bulma.css'

export default function Home() {
  const [error, setError] = useState('')
  const [web3, setWeb3] = useState()
  const [address, setAddress] = useState()

  const connectWalletHandler = async () => {
    /* check if MetaMask is installed */
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        try {
          /* request wallet connect */
          await window.ethereum.request({ method: "eth_requestAccounts" })
          /* create web3 instance and set to state var */
          const web3 = new Web3(window.ethereum)
          /* get list of wallet accounts */
          const accounts = await web3.eth.getAccounts()
          /* set Account 1 to React state var */
          setAddress(accounts[0])
          /* set web3 instance */
          setWeb3(web3)

          /* create local contract copy */
          // const lc = lotteryContract(web3)
          // setLotteryContract(lc)
        } catch(err) {
          setError(err.message)
        }
    } else {
        // meta mask is not installed
        console.log("Please install MetaMask")
    }
  }

  return (
    <div>
      <Head>
        <title>Ether Lottery</title>
        <meta name="description" content="Ethereum Lottery dApp" />
      </Head>

      <div className={styles.main}>
        <nav className="navbar mt-4 mb-4">
          <div className="container">
            <div className="navbar-brand">
              <img src="/images/logo.png" />
              {/* <h1>Ether Lottery</h1> */}
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
                  <p className={styles.description}>
                    Enter the lottery by sending 0.01 Eth:
                  </p>
                  <button className="button is-link is-large is-light mt-3">Play now</button>
                  <div className="container has-text-danger">
                    <p>{error}</p>
                </div>
                </section>
                <section className="mt-6">
                  <p className={styles.description}>
                    <b>Admin only:</b> Pick winner
                  </p>
                  <button className="button is-primary is-large is-light mt-3">Pick winner</button>
                  <div className="container has-text-danger">
                    <p>{error}</p>
                </div>
                </section>
              </div>
              <div className="column is-one-third">
                <section className="mt-5">
                  <div className="card">
                    <div className="card-content">
                      <div className="content">
                        <h2>Lottery History</h2>
                        <div className="history-entry">
                          <div>Lottery #1 winner:</div>
                          <div>
                            <a href="https://etherscan.io/address/0x484F62a1A508107F39633C37c9071d68b8528fe5" target="_bank">
                              0x484F62a1A508107F39633C37c9071d68b8528fe5
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="mt-5">
                  <div className="card">
                    <div className="card-content">
                      <div className="content">
                        <h2>Players (1)</h2>
                        <div>
                          <a href="https://etherscan.io/address/0x484F62a1A508107F39633C37c9071d68b8528fe5" target="_bank">
                            0x484F62a1A508107F39633C37c9071d68b8528fe5
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="mt-5">
                  <div className="card">
                    <div className="card-content">
                      <div className="content">
                        <h2>Pot</h2>
                        <p>10 Ether</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>&copy; 2022 Block Explorer</p>
      </footer>
    </div>
  )
}
