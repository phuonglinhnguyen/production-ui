import * as React from 'react';
import { redirectApp, getAppURL } from '@dgtx/coreui'
import { Error404 } from '../../../../@components'
export  class Page404 extends React.PureComponent {
  componentDidMount=()=> {
      if(window){
        window.addEventListener('keydown',this.handleKeyDown)
      }
  }
  // handleKeyDown=(event)=>{
  //   let key =event.key.toLowerCase();//'enter', 
  //   if(['backspace','escape','arrowleft','arrowup'].includes(key)){
  //     redirectApp(getAppURL())
  //   }
  // }  
  render() {
    return (
      <Error404  {...this.props} />
    )
  }
}
