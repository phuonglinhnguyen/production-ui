import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Viewer from './viewer'
import { analyzeConfig } from './analysis';
import Toolbar from './tool_bar';
import ToolbarEditPoly from './tool_bar_edit';
import { isEqual } from 'lodash'


 

export default class Controler extends Component {
   constructor(props) {
      super(props);
      this.state = {
         config: {
            draw: true,
            focusField: true,
            focusLine: true,
            single: true,
            pageId: 0,
            current: 0,
            sections: [],
            field: {},
            ratio: 1,
            ...getStateInStorage(props.username, props.keyStorage)
         }
      }
   }
   componentWillMount() {
      let {
         valueField,
         current,
         active = {},
         lines,
         sections,
         single,
      } = this.props.config;
      try {
         let data = analyzeConfig({ sections, active, lines })
         this.setState({
            config: { ...this.state.config, ...data, current, single },
         }, () => { this.setStorage() })
      } catch (error) {

      }
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
   componentWillReceiveProps(nextProps) {
      let {
         valueField,
         current,
         active = {},
         lines,
         sections,
         single,
      } = nextProps.config;
      if (!isEqual(sections, this.props.config.sections) || !isEqual(active, this.props.config.active) || !isEqual(lines, this.props.config.lines)) {
         try {
            let data = analyzeConfig({ sections, active, lines })
            this.setState({
               config: { ...this.state.config, ...data, current, single },
            })
         } catch (error) {
            
         }
      }
      if (!isEqual(current, this.props.config.current)) {
         this.setState({
            config: { ...this.state.config, current },
         })
      }
      if (!isEqual(single, this.props.config.single)) {
         this.setState({
            config: { ...this.state.config, single },
         })
      }
   }
   onChangeConfig = (name, value) => {
      this.setState({
         config: {
            ...this.state.config,
            [name]: value
         }
      }, () => { this.setStorage() })
   }
   render() {
      const { width, height, data, highlightPolygons, onDrap, onClick, keyStorage, username } = this.props;
      return (
         <div style={{ width, height, position: 'relative' }}>
            <Viewer
               data={data}
               ratio={this.state.config.ratio}
               width={width} height={height}
               config={this.state.config}
               highlightPolygons={highlightPolygons}
               onClick={onClick}
               onDrap={onDrap}
               onChangeRatio={ratio => {
                  setRatioInStorage(username, keyStorage, ratio)
               }}
            />
            <Toolbar config={this.state.config} onChange={this.onChangeConfig} />
            <ToolbarEditPoly />
         </div>
      )
   }
}
