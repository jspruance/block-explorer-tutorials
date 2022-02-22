# Treasury
The treasury smart contract is able to accept deposits of WETH and USDC tokens. To facilitate this, the depositor must first pre-approve the deposit by the treasury on their behalf by invoking the ERC20 'approve' function and specifying the approval amount and the treasury address.

There is a simple UI - 'treasury-dapp' - in the project root folder that allows users to pre-approve deposits.

The treasury contract will also issue shares of 'TreasuryTokens' corresponding to the investor's proportional share of the treasury pool, as calculated in Ether.

After deposits ahve been made, the following steps should be taken to pay out the Treasury Tokens:

1) First invoke 'getLatestPrice' to get the latest Ether price from the Chainlink oracle.

2) Calculate the investor's share in the pool by invoking 'getInvestorPoolShare()'

3) Pay the investor in TreasyTokens 'distributeShareholderTokens()'

The treasury smart contract is deployed to the Kovan test network at the address:
0xc9A2B5e382E417844794E36c1C0DCA16E88A094d

Treasury contract Tx hashes:

Deposit 1, acct 1: (100000000000000000 WETH)
https://kovan.etherscan.io/tx/0xd452bc23afaa984720df13b6d3838fb6a1d30420e6dcb88d02e35f5c9d6406d1

Deposit 2, acct 2: (100000000000000000 WETH)
https://kovan.etherscan.io/tx/0x9c739eb621d61b367d1f4d390a2c30ad919cdab2e452194259c22a8cad08285a

Transfer shares, acct 1 (500000000000000000000000 TRTO):
https://kovan.etherscan.io/tx/0xa89bb210329e7d080b3a598df44e2bc7b583fe268915cb9e21e35ebfb547d78c

# One Percent Token
OnePercentToken was deployed with a capped supply of 1,000,000 tokens. Half of those are distributed to the owner on contract creation.

The contract keeps a dynamic array of token holders and after each token transfer by any holder, each holder's total holdings are increased by 1%.

One Percent Token contract address (Kovan):
0xbFDf60fF5a95512fA25e06ff798D37F63777680a

One Percent Token Tx hashes:

Transfer of 1000 tokens from acct1 to acct2:
https://kovan.etherscan.io/tx/0x47bb0fa85f17c24312781f28d146ddf6c20d39f46f66e34a3f96a674180fc5ed
