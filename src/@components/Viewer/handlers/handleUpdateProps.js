import { FEATURES, RectangleStyles ,TRIGGER_DRAW_POYLILINES} from "@dgtx/su-viewer";
import { analyzeConfig } from "../analysis";

import {  isEqual} from 'lodash'
import { StateViewer } from "../utils";

const getTypeInput=(active,sections)=>{
   if(!active){return};
   const {sectionName , fieldName} =active;
   let result ;
   let section = sections[sections.findIndex(section =>section.name ===sectionName)];
   if(section){
       let field = section.fields[section.fields.findIndex(field =>field.name ===fieldName)];
       if(field){
         result = field.control_type
       }
   }
   return result;
}


export default (self, nextProps) => {
   let {
      valueField,
      current,
      active = {},
      lines,
      sections,
      single,
   } = nextProps.config;
   if(!isEqual(self.props.config,nextProps.config)){
      if (!isEqual(sections, self.props.config.sections) 
       || !isEqual(active, self.props.config.active)
       || !isEqual(lines, self.props.config.lines)) {
         try {
            let data = analyzeConfig({ sections, active, lines })
            let type_input = getTypeInput(active,sections)
            let draw_polyline ={...self.state.draw_polyline}
            if(type_input==="TEXTFIELD"){
               draw_polyline.disableAdd = false;
            }else{
               draw_polyline.disableAdd = true;
            }
            // self.setState({
            //    config: { ...self.state.config, ...data, current, single },
            // })
            self.setState({config: { ...self.state.config, ...data, current, single },draw_polyline},()=>{
               
               renderConfigEffect(self,self.state.config)
            })
         } catch (error) {
   
         }
      }
      
   }else {
      if (!isEqual(current, self.props.config.current)||!isEqual(single, self.props.config.single)) {
         self.setState({
            config: { ...self.state.config, current, single },
         },(state)=>{
            renderConfigEffect(self,self.state.config)
         }
         )
      }
   }
   if (nextProps.data && !isEqual(self.props.data, nextProps.data)) {
      self.mainController.loadDatum(nextProps.data);
      if (StateViewer.getState()) {
         self.mainController.setState(StateViewer.getState());
      }
    }
    if (!isEqual(nextProps.highlightPolygons, self.props.highlightPolygons)) {
      self.mainController.sethighlightPolygons(nextProps.highlightPolygons || []);
    }
    
    if (!isEqual(nextProps.polylines, self.props.polylines)) {
      self.mainController.setData(TRIGGER_DRAW_POYLILINES.SET_DATA, nextProps.polylines|| []);
    }else{
       try {
          if(!isEqual(self.mainController.feature.features[0].data,nextProps.polylines)){
            self.mainController.setData(TRIGGER_DRAW_POYLILINES.SET_DATA, nextProps.polylines|| []);
          }
       } catch (error) {
          console.log('====================================');
          console.log(error);
          console.log('====================================');
       }
    }
    if (!isEqual(nextProps.wordStylesDefault, self.props.wordStylesDefault) 
    || !isEqual(nextProps.wordStylesHover, self.props.wordStylesHover) 
    || !isEqual(nextProps.wordStylesSelect, self.props.wordStylesSelect)) {
      var rectangeWordStyle = {
        default: Object.assign({}, RectangleStyles.default.default, nextProps.wordStylesDefault || {}),
        hover: Object.assign({}, RectangleStyles.default.hover, nextProps.wordStylesHover || {}),
        select: Object.assign({}, RectangleStyles.default.select, nextProps.wordStylesSelect || {})
      };
      self.mainController.setWordStyle(rectangeWordStyle);
    }
};

export const renderConfigEffect = (self, config) => {
   let { focusField, focusLine, draw, pageId, current, single, sections, field } = config;
   let data = {
      draw,
      current: Number(current),
      section: Number(pageId),
      pageId,
      field: field,
      focusField,
      focusLine,
      sections
   }
   let dataNone = {
      draw: false,
      current: Number(current),
      section: Number(pageId),
      pageId,
      field: field,
      focusField: false,
      focusLine: false,
      sections
   }
   if (single) {
      if (self.mainController.getStatusFeature()[FEATURES.SECTION_LINES] === 'active') {
         self.mainController.setData("section", dataNone)
         self.mainController.deActiveFeatures([FEATURES.SECTION_LINES])
      }
      if (self.mainController.getStatusFeature()[FEATURES.FIELD_FOCUS] !== 'active') {
         self.mainController.activeFeatures([FEATURES.FIELD_FOCUS]);
      }
      self.mainController.setData("field", data)
   } else {
      if (self.mainController.getStatusFeature()[FEATURES.FIELD_FOCUS] === 'active') {
         self.mainController.setData("field", dataNone)
         self.mainController.deActiveFeatures([FEATURES.FIELD_FOCUS]);
      }
      if (self.mainController.getStatusFeature()[FEATURES.SECTION_LINES] !== 'active') {
         self.mainController.activeFeatures([FEATURES.SECTION_LINES])
      }
      self.mainController.setData("section", data)
   }
}