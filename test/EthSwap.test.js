const { assert } = require('chai')

const Token = artifacts.require("Token")
const EthSwap = artifacts.require("EthSwap")

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('EthSwap', ([deployer, investor]) => {
    let token, ethSwap

    function tokens(n) {
        return web3.utils.toWei(n, 'ether')
    }

    before(async () => {
        token = await Token.new()
        ethSwap = await EthSwap.new(token.address)
        await token.transfer(ethSwap.address, tokens("1000000"))
    })

    describe('Token deployment', async () => {
        it('token has a name', async () => {
            const name = await token.name()
            assert.equal(name, 'Pannam', 'name not found!!')
        })
    })

    describe('EthSwap deployment', async () => {
        it('contract has a name', async () => {
            const name = await ethSwap.name()
            assert.equal(name, "Eswap", "name not found!!")
        })

        it('check balance of EthSwap', async () => {
            const balance = await token.balanceOf(ethSwap.address)
            assert.equal(balance.toString(), tokens("1000000"))
        })

    })

    describe("buyTokens()", async () => {
        let result
        before(async () => {
            result = await ethSwap.buyTokens({ from: investor, value: web3.utils.toWei('1', 'ether') })
        })
        it('Allows user to purchase tokens from ethswap for fixed amount of price', async () => {
            // check investor balance
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('100'))

            //check Ethswap balance
            let ethSwapBalance
            ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), tokens('999900'))
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1', 'ether'))

            const event = await result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), tokens('100').toString())
            assert.equal(event.rate.toString(), '100')

        })
    })

    describe("sellTokens()", async () => {
        let result
        before(async () => {
            await token.approve(ethSwap.address, tokens('100'), { from: investor })
            result = await ethSwap.sellTokens(tokens('100'), { from: investor })
        })
        it('Allows user to sell tokens to ethswap for fixed amount of price', async () => {
            // check investor balance
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('0'))

            //check Ethswap balance
            let ethSwapBalance
            ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), tokens('1000000'))
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('0', 'ether'))

            const event = await result.logs[0].args
            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), tokens('100').toString())
            assert.equal(event.rate.toString(), '100')

            //FAILURE: investor can't sell more tokens than they posess
            await ethSwap.sellTokens(tokens('500'), {from: investor}).should.be.rejected
        })
    })
})