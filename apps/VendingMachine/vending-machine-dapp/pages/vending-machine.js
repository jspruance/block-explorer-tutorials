import Head from 'next/head'
import { useState, useEffect } from 'react'
import Web3 from 'web3'
import vendingMachineContract from '../blockchain/vending'
import 'bulma/css/bulma.css'
import styles from '../styles/VendingMachine.module.css'

const VendingMachine = () => {
    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [inventory, setInventory] = useState('')
    const [myDonutCount, setMyDonutCount] = useState('')
    const [buyCount, setBuyCount] = useState('')
    const [web3, setWeb3] = useState(null)
    const [address, setAddress] = useState(null)
    const [vmContract, setVmContract] = useState(null)
    const [web3, setWeb3] = useState(null)

    useEffect(() => {
      if (vmContract) getInventoryHandler()
      if (vmContract && address) getMyDonutCountHandler()
    }, [vmContract, address])

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
      try {
<<<<<<< HEAD:apps/VendingMachine/vending-machine-app/pages/vending-machine.js
        await vmContract.methods.purchase(buyCount).send({
          from: address,
          value: web3.utils.toWei('2', 'ether') * buyCount
=======
        console.log("try to purchase")
        await vmContract.methods.purchase(parseInt(buyCount)).send({
          from: address,
          value: web3.utils.toWei('2', 'ether') * buyCount,
          gas: 3000000,
          gasPrice: null
>>>>>>> 486bbb95766046cd17636c19aab8472a9d897742:apps/VendingMachine/vending-machine-dapp/pages/vending-machine.js
        })
        setSuccessMsg(`${buyCount} donuts purchased!`)

        if (vmContract) getInventoryHandler()
        if (vmContract && address) getMyDonutCountHandler()
      } catch(err) {
        setError(err.message)
      }
    }

    const connectWalletHandler = async () => {
      /* check if MetaMask is available */
      if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
          try {
            /* request wallet connect */
            await window.ethereum.request({ method: "eth_requestAccounts" })
            /* set web3 instamce */
            const web3 = new Web3(window.ethereum)
            setWeb3(web3)
            /* get list of accounts */
            const accounts = await web3.eth.getAccounts()
            setAddress(accounts[0])
<<<<<<< HEAD:apps/VendingMachine/vending-machine-app/pages/vending-machine.js
=======
            /* set web3 instance */
            setWeb3(web3)

>>>>>>> 486bbb95766046cd17636c19aab8472a9d897742:apps/VendingMachine/vending-machine-dapp/pages/vending-machine.js
            /* create local contract copy */
            const vm = vendingMachineContract(web3)
            setVmContract(vm)
          } catch(err) {
            setError(err.message)
          }
      } else {
          // meta mast not installed
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
          <section>
              <div className="container has-text-success">
                  <p>{successMsg}</p>
              </div>
          </section>
        </div>
    )
}

export default VendingMachine