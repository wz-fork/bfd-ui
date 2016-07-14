import React from 'react'
import ReactDOM from 'react-dom'
import xhr from '../xhr'
import classnames from 'classnames'
import './main.less'

export default React.createClass({

  getInitialState() {
    return {
      xhr: null,
      msg: null
    }
  },

  shouldComponentUpdate(nextProps) {
    if (this.props.url !== nextProps.url) {
      this.fetch()
      return false
    }
    return true
  },
  
  componentDidMount() {
    this.props.url && this.fetch()
  },

  fetch() {
    this.lazyFetch()
    this.props.onFetch && this.props.onFetch()
    setTimeout(() => {
      xhr({
        url: this.props.url,
        complete: () => {
          clearTimeout(this.loadingTimer)
        },
        success: this.handleSuccess,
        error: this.handleError
      })
    }, this.props.delay || 0)
  },

  lazyFetch() {
    this.loadingTimer = setTimeout(() => {
      this.setState({xhr: 'loading'})
    }, 150)
  },

  handleSuccess(data) {
    this.setState({xhr: 'success'})
    this.props.onSuccess(data)
  },

  handleError(msg) {
    this.setState({xhr: 'error', msg})
  },

  render() {
    const { className, ...other } = this.props
    return (
      <div ref="container" className={classnames('bfd-fetch', className)} {...other}>
        {this.props.url && this.state.xhr !== 'success' ? (
          <div className="fetch-mask">
          {(() => {
            switch(this.state.xhr) {
              case 'loading': return (
                <div className="state loading">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              )
              case 'error': return <div className="state error">{this.state.msg}</div>
            }
          })()}
          </div>
        ) : null}
        {this.props.children}
      </div>
    )
  }
})