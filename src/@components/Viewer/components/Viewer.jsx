import * as React from 'react';
import { isEqual } from 'lodash'
import { MainController, RectangleStyles, EVENT_BASE, FEATURES, EVENT_DRAW_POYLILINES } from '@dgtx/su-viewer'
import RenderView from './RenderView'
import Toolbar from './Toolbar'
import { handleKeyDown, handleUpdateProps, handleChangeByToolbar } from '../handlers'
import { cancelEvent, StateViewer, getStateInStorage, setStateInStorage, setRatioInStorage } from '../utils'
import { analyzeConfig } from '../analysis';
import { renderConfigEffect } from '../handlers/handleUpdateProps';




const defaultPropsViewer = {
   zoom_range: [10, 1000],
   ratio: 1,
   width: 500,
   height: 600,
   viewType: 'key',
   viewDirection: 'v',
   resultInline: true,
   wrapperStyle: {},
   wordStylesDefault: {},
   wordStylesHover: {},
   wordStylesSelect: {},
   rectangleSelectStyles: {},
   tooltipBackgroundStyle: {},
   tooltipTextStyles: {},
   highlightPolygons: [],
   highlightStyle: {},
   forcusPolygon: null,
   focus: null,
   data: [],
   onClick: function onClick() {
      return undefined;
   },
   onDrap: function onDrap() {
      return undefined;
   },
   onViewPage: function onViewPage() {
      return undefined;
   },
   onDrawDelete:function onDrawDelete() {
      return undefined;
   }
}


export default class Viewer extends React.Component {
   static defaultProps = { ...defaultPropsViewer }
   constructor(props) {
      super(props);
      const { config } = props;
      const {
         valueField,
         current,
         active = {},
         lines,
         sections,
         single,
      } = config
      let data = {}
      try {
         data = analyzeConfig({ sections, active, lines })
      } catch (error) {
      }
      this.state = {
         config: {
            current,
            single,
            draw: true,
            focusField: true,
            focusLine: true,
            pageId: 0,
            sections: [],
            field: {},
            ratio: 1,
            ...data,
            ...getStateInStorage(props.username, props.keyStorage)
         },
         rotate: {
            step: 0,
            tangle: 0
         },
         draw_polyline: {
            edit: false,
            adding: false,
            disableAdd:false,
            awaitDone:false
         }
      }
      this.setStorage();
      this.inital(props);
   }

   componentWillReceiveProps = (nextProps) => {
      handleUpdateProps(this, nextProps)
   }
   shouldComponentUpdate = (nextProps, nextState) => {
      let shouldUpdate = !isEqual(this.props, nextProps)
         || !isEqual(this.state, nextState)
      return shouldUpdate;
   }
   componentDidMount = () => {
      const {
         data,
         wordStylesDefault = {},
         wordStylesHover = {},
         wordStylesSelect = {},
      } = this.props;
      this._wrapper.addEventListener("mousedown", this.handleOnMouseDown, false);
      if (data) {
         this.mainController.loadDatum(data);
         if (StateViewer.getState()) {
            this.mainController.setState(StateViewer.getState());
         }
      }
      const wordStyle = {
         default: { ...RectangleStyles.default.default, ...wordStylesDefault },
         hover: { ...RectangleStyles.default.hover, ...wordStylesHover },
         select: { ...RectangleStyles.default.select, ...wordStylesSelect },
      };
      this.mainController.setWordStyle(wordStyle);
      this.mainController.sethighlightPolygons(this.props.highlightPolygons);
      renderConfigEffect(this, this.state.config)
   }
   componentWillUnmount = () => {
      this._wrapper.removeEventListener("mousedown", this.handleOnMouseDown, false)
   }
   componentDidUpdate = () => {
      this.mainController.render();
   }

   inital = (props) => {
      this.mainController = new MainController(this);
      this.mainController.addListener('scroll', StateViewer.setState)
      this.mainController.addListener('rotate', StateViewer.setState)
      this.mainController.addListener('ratio', StateViewer.setState)
      this.mainController.addListener(EVENT_BASE.ON_CHANGE_RATIO, this.handleChangeRatio);
      this.mainController.addListener(EVENT_BASE.ON_CLICK_ITEM, this.handleClickItem);
      this.mainController.addListener(EVENT_BASE.ON_DRAP_ITEMS, this.handleDrapItems);
      this.mainController.addListener(EVENT_DRAW_POYLILINES.ON_DRAW_DONE, this.handleDrawDone);
      this.mainController.addListener(EVENT_DRAW_POYLILINES.ON_DRAW_CHANGE, this.handleDrawChange);
      this.mainController.addListener(EVENT_DRAW_POYLILINES.ON_VIEW_SELECT, this.handleDrawSelect);
      this.mainController.addListener(EVENT_DRAW_POYLILINES.ON_DRAW_CHANGE_STATE, this.handleChangeState);
      this.mainController.addListener(EVENT_DRAW_POYLILINES.ON_DRAW_DELETE, this.handleDrawDelete);
      this.mainController.activeFeatures(FEATURES.DRAW_POLY)
   } 
   handleDrawDelete=(data)=>{
      this.props.onDrawDelete(data)
   }
   handleChangeState=(data)=>{
      if(data ==="error"){
         this.setState({draw_polyline:{...this.state.draw_polyline,adding:true}})
      }
   }
   handleDrawSelect=(data)=>{
      // console.log('=========handleDrawSelect===========================');
      // console.log(data);
      // console.log('====================================');
   }
   handleDrawChange=(data)=>{
     
   }
   handleDrawDone=(data)=>{
      this.setState({draw_polyline:{edit:true,adding:false,awaitDone:false}})
      this.props.onDraw(data)
   }
   handleClickItem = (data) => {
      this.props.onClick(data)
   }
   handleDrapItems = (data) => {
      this.props.onDrap(data)
   }

   handleChangeRatio = (ratio) => {
      const { username, keyStorage } = this.props;
      setRatioInStorage(username, keyStorage, ratio)
   }
   handleKeyDown = (event) => {
      handleKeyDown(this, event)
   }
   handleOnMouseClick = (event) => {
      cancelEvent(event)
   }
   handleOnMouseDown = (event) => {
      cancelEvent(event)
   }
   handleChangeByToolbar = (name, value) => {
      handleChangeByToolbar(this, { name, value })
   }
   setStorage() {
      const { keyStorage, username } = this.props;
      const { draw, focusField, focusLine } = this.state.config;
      let stateStorage = {
         draw,
         focusField,
         focusLine,
      }
      setStateInStorage(username, keyStorage, stateStorage)
   }
   addRef = (name) => (node) => {
      this.mainController.setElement(name, node);
   }
   render() {
      const { width, height, wrapperStyle = {} ,editable} = this.props;
      const { rotate, config, draw_polyline } = this.state;
      let _wrapperStyle = { backgroundColor: '#404040', ...wrapperStyle };
      return (
         <div style={{ width, height, position: 'relative' }}>
            <RenderView
               registerRef={this.addRef}
               setRefWrap={node => this._wrapper = node}
               onKeyDown={this.handleKeyDown}
               width={width}
               height={height}
               wrapperStyle={_wrapperStyle}
            />
            <Toolbar config={config} editable={editable} draw_polyline={draw_polyline} rotate={rotate} onChange={this.handleChangeByToolbar} />
         </div>
      )
   }
}
