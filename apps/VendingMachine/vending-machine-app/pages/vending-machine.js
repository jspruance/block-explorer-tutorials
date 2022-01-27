import Head from 'next/head'
import { useState, useEffect } from 'react'
import Web3 from 'web3'
import vmContract from '../blockchain/vending'
import 'bulma/css/bulma.css'
import styles from '../styles/VendingMachine.module.css'

const VendingMachine = () => {
    const [error, setError] = useState('')
    const [inventory, setInventory] = useState('')
    const [myDonutCount, setMyDonutCount] = useState('')
    const [buyCount, setBuyCount] = useState('')
    const [address, setAddress] = useState(null)

    useEffect(async () => {
      getInventoryHandler()
    })

    const getInventoryHandler = async () => {
      const inventory = await vmContract.methods.getVendingMachineBalance().call()
      setInventory(inventory)
    }

    const getMyDonutCountHandler = async () => {
      const count = await vmContract.methods.donutBalances(address).call()
      setMyDonutCount(count)
    }

    const updateDonutQty = event => {
      setBuyCount(event.target.value)
    }

    const buyDonutHandler = async () => {
      console.log(`buy address ::: ${address}`)
      try {
        console.log("try to purchase")
        await vmContract.methods.purchase(buyCount).send({
          from: address
        })
      } catch(err) {
        setError(err.message)
      }
    }

    const connectWalletHandler = async () => {
      if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
          try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            const web3 = new Web3(window.ethereum)
            accounts = await web3.eth.getAccounts()
            setAddress(accounts[0])
            console.log(`connected address ::: ${address}`)
            getMyDonutCountHandler()
          } catch(err) {
            setError(err.message)
          }
      } else {
          // meta mask is not installed
          console.log("Please install MetaMask")
      }
    }

    return (
        <div className={styles.main}>
          <Head>
            <title>VendingMachine App</title>
            <meta name="description" content="A blockchain vending app" />
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
          <section className="mt-5">
              <div className="container">
                <div className="field">
                  <label className="label">Buy donuts</label>
                  <div className="control">
                    <input onChange={updateDonutQty} className="input" type="type" placeholder="Enter amount..." />
                  </div>
                  <button 
                    onClick={buyDonutHandler} 
                    className="button is-primary mt-2"
                  >Buy</button>
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