const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Treasury contract", function () {
  // test global variables
  let Treasury;
  let treasury;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Treasury = await ethers.getContractFactory("Treasury");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Treasury.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    treasury = await Treasury.deploy();
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
      expect(await treasury.owner()).to.equal(owner.address);
    });
  });

  describe("Treasury Token balance", function() {
      it("Should show an initial Treasury Token balance", async function() {
        const balance = await treasury.getTreasuryTokenBalance()
        expect(balance.toString()).to.equal('1000000000000000000000000');
      })
  })

  // describe("Deposit WETH", function () {
  //   it("Should accept WETH deposits and update the user's balance", async function () {
  //       // Expect user's balance to be incremented to reflect deposit
  //       // TODO: figure out how to call 'approve' on Kova weth contract for this test
  //       await treasury.connect(addr1).depositWeth(1, { value: 30000 });
  //       expect(wethBalances[addr1] == 1);
  //   });
  // });

});