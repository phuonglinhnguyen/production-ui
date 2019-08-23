import { EVENT_TOOLBAR } from '../components/Toolbar'
import { renderConfigEffect } from './handleUpdateProps';
import { TRIGGER_DRAW_POYLILINES ,MODE_FEATURE_DRAWPOLYLINE } from '@dgtx/su-viewer';


export default (self, data) => {
   const { name, value } = data;
   switch (name) {
      /**handle rotate */
      case EVENT_TOOLBAR.CHANGE_ROTATE_STEP:{
         self.setState({rotate:
            {tangle:0,step:value}
         })
         self.mainController.setRotate(0,value * 90)
         break;
      }
      case EVENT_TOOLBAR.CHANGE_ROTATE_TANGLE:{
         const step = self.state.rotate.step
         self.setState({rotate:
            {step,tangle:value}
         })
         self.mainController.setRotate(0,step * 90 +value/100)
         break;
      }
      /**end handle rotate */
      case EVENT_TOOLBAR.CHANGE_OPTIONS:{
         self.setState({config:{...self.state.config,[value.key]:value.value}},(state)=>{
            self.setStorage();
            renderConfigEffect(self,self.state.config)
         })
         break;
      }
      case EVENT_TOOLBAR.CHANGE_EDIT_POLY:{
         if(value.key==="edit"){
            if(value.value){
               self.mainController.setData(TRIGGER_DRAW_POYLILINES.SET_MODE ,MODE_FEATURE_DRAWPOLYLINE.EDIT)
               self.setState({draw_polyline:{...self.state.draw_polyline,[value.key]:value.value}})
            }else if(!self.state.draw_polyline.adding){
               self.setState({draw_polyline:{...self.state.draw_polyline,[value.key]:value.value}})
               self.mainController.setData(TRIGGER_DRAW_POYLILINES.SET_MODE,MODE_FEATURE_DRAWPOLYLINE.VIEW)
            }
         } 
         if(value.key==="adding"){
            if(value.value){
               if(self.props.config.active){
                  let item = {data:self.props.config.active,points:[],state:"adding"}
                  self.mainController.setData(TRIGGER_DRAW_POYLILINES.ADD,item)
                  self.setState({draw_polyline:{...self.state.draw_polyline,[value.key]:value.value}})
               }
            }
         } 
         break;
      }
      default:
         break;
   }
}