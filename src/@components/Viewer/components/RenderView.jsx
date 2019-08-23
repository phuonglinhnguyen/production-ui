import * as React from 'react';
import EventListener from 'react-event-listener';
import {  WRAPPER, STAGES } from '@dgtx/su-viewer'
import './viewer.css'
const RenderView = (props) => {
   const {
     registerRef,
     setRefWrap,
     onKeyDown,
     width,
     height,
     wrapperStyle = {}
   } = props;
   return (
     <div ref={setRefWrap} style={{ width, height, position: 'relative', ...wrapperStyle }}>
       <EventListener target="window" onKeyDown={onKeyDown} />
       <div ref={registerRef(WRAPPER)} style={{ width, height, position: 'relative', }}>
         <canvas ref={registerRef(STAGES.IMAGE)} width={width} height={height} className='viewer-canvas' />
         <canvas ref={registerRef(STAGES.DATUM)} width={width} height={height} className='viewer-canvas' />
         <canvas ref={registerRef(STAGES.DRAW)} width={width} height={height} className='viewer-canvas' />
         <canvas ref={registerRef(STAGES.EVENT)} width={width} height={height} className='viewer-canvas' />
       </div>
     </div>
   )
 }
 export default React.memo(RenderView)