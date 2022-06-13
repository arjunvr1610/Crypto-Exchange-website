import React, { Component } from 'react'
import BuyForm from './BuyForm'
import SellForm from './SellForm'

export class Main extends Component {
  constructor(props) {
      super(props)
      this.state = {
        form: 'buy'
      }
  }
  render() {
    let content
    if(this.state.form === 'buy'){
        content =  <BuyForm
            buyTokens = {this.props.buyTokens}
            ethBalance = {this.props.ethBalance}
            tokenBalance = {this.props.tokenBalance}
        />
    } else {
        content = <SellForm 
            sellTokens = {this.props.sellTokens}
            ethBalance = {this.props.ethBalance}
            tokenBalance = {this.props.tokenBalance}
        />
    }

    const clickBuy = (event) => {
        this.setState({form: 'buy'})
    }

    const clickSell = (event) => {
        this.setState({form: 'sell'})
    }

    return (
      <div id='content' className='mt-3'>
        <div className='d-flex justify-content-between mb-3'>
            <button className='btn btn-light' onClick={clickBuy}>Buy</button>
            <span className="text-muted">&lt; &nbsp; &gt;</span>
            <button className='btn btn-light' onClick={clickSell}>Sell</button>
        </div>
        <div className='card mb-4'>
            <div className="card-body">
                {content}
            </div>
        </div>
      </div>
    )
  }
}

export default Main
