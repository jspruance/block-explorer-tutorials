const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("OnePercentToken contract", function () {
  // test global variables
  let Token;
  let OnePercentToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("OnePercentToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    OnePercentToken = await Token.deploy(1000000);
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
      // Expect receives a value, and wraps it in an Assertion object. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
      expect(await OnePercentToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await OnePercentToken.balanceOf(owner.address);
      expect(await OnePercentToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts and add 1%", async function () {
      // Transfer 1000 tokens from owner to addr1
      await OnePercentToken.transfer(addr1.address, 1000);
      const addr1Balance = await OnePercentToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(1010);

      // Transfer 1000 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await OnePercentToken.connect(addr1).transfer(addr2.address, 1000);
      const addr2Balance = await OnePercentToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(1010);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await OnePercentToken.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(
        OnePercentToken.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed.
      expect(await OnePercentToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

  });
});