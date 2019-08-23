// import * as  React from 'react'
export const stopEvent=(event:Event)=>{
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent&&event.nativeEvent.stopImmediatePropagation();
}