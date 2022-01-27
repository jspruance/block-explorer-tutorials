import Head from 'next/head'
import { useState, useEffect } from 'react'
import 'bulma/css/bulma.css'
import Web3 from 'web3'
import vmContract from '../blockchain/vending'
import styles from '../styles/VendingMachine.module.css'

const VendingMachine = () => {
  const [error, setError] = useState('')
  const [inventory, setInventory] = useState('')
  const [myDonutCount, setMyDonutCount] = useState('')

  let web3

  useEffect(() => {
    getInventoryHandler()
  }, ['inventory', 'myDonutCount'])

  const getInventoryHandler = async() => {
    const inventory = await vmContract.methods.getVendingMachineBalance().call()
    setInventory(inventory)
  }

  const getMyDonutCountHandler = async() => {
    const accounts = await web3.eth.getAccounts()
    const count = await vmContract.methods.donutBalances(accounts[0]).call()
    setMyDonutCount(count)
  }

  const buyDonutHandler = (event) => {
    console.log(`donut qty :::: ${event.target.value}`)
  }

  const connectWalletHandler = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      // We are in the browser and metamask is running.
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        web3 = new Web3(window.ethereum)
        getMyDonutCountHandler()
      } catch(error) {
        setError("Please install MetaMask")
      }
    } else {
      setError("Please install MetaMask")
    }
  }

  return (
    <div className={styles.main}>
      <Head>
        <title>Vending Machine</title>
        <meta name="description" content="Vending machine dApp" />
      </Head>
      <nav className="navbar mt-4 mb-4">
        <div className="container">
          <div className="navbar-brand">
            <h1>Vending Machine</h1>
          </div>
          <div className="navbar-end">
            <button onClick={connectWalletHandler} className="button is-primary">Connect Wallet</button>
          </div>
        </div>
      </nav>
      <section>  
		    <div className="container">
          <h2>Vending machine inventory: {inventory}</h2>
        </div>
      </section>
      <section>  
		    <div className="container">
          <h2>My donuts: {myDonutCount}</h2>
        </div>
      </section>
      <section>  
		    <div className="container">
          <div className="field">
            <label className="label">Buy donuts:</label>
            <div className="control">
              <input onChange={buyDonutHandler} className="input" type="text" placeholder="Enter amount..." />
            </div>
            <button className="button is-primary">Buy</button>
          </div>
        </div>
      </section>
      <section>  
		    <div className="container has-text-danger">
          <p>{error}</p>
        </div>
      </section>
    </div>
  )
}

export default VendingMachine