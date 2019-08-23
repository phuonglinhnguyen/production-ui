import * as React from 'react'

export const ErrorSection = (errors) => {
   return (
     <ul style={{
       minWidth: 500,
       listStyle: 'none',
       paddingLeft: 0
     }}>
       {errors.map(item => {
         return (
           <li style={{ margin: "12px 0px" }} >
             <span style={{ fontSize: "16px", color: "rgb(232,169,12)", display: "inline-block", width: "100%", position: "relative" }} >Section: {item.section}
               <div style={{
                 content: " ",
                 height: 1,
                 width: 200,
                 background: 'linear-gradient(90deg,#646464 0,rgba(85,85,85,0))',
                 position: 'absolute',
                 left: -2
               }} />
             </span>
             <span style={{ fontSize: "0.9em", color: "rgba(255,255,255,0.8)" }}>{item.datas.map(er => er.message).join(';')}</span>
           </li>
         )
       })}
     </ul>
   )
 }
 