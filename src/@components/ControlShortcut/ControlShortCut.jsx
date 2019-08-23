// @flow strict
import * as React from 'react';
import { isEqual } from 'lodash'
import EventListener from 'react-event-listener';
import { getIn, setIn, stopEvent } from '../utils'
type ConfigListener = {
   key: string[],
   handle: Function
}

type Props = {
   listeners: ConfigListener[],
};
export class ControlShortcut extends React.Component<Props> {
   componentWillReceiveProps(nextProps) {
      if (!isEqual(this.props.listeners, nextProps.listeners)) {
         this.loadListeners(nextProps.listeners)
      }
   }
   shouldComponentUpdate(nextProps) {
      return this.props.disabled !== nextProps.disabled

   }
   componentDidMount = () => {
      this.loadListeners(this.props.listeners);
   }
   loadListeners = (listeners = []) => {
      let behavior = {};
      listeners.forEach((listener: ConfigListener) => {
         setIn(behavior, listener.key, listener.handle);
      })
      this._behavior = behavior
   }
   handleKeyDown = (event) => {
      const { dispatch, validating } = this.props;
      if (validating) return;
      const { altKey, ctrlKey, shiftKey, key, keyCode } = event;
      let path = [];
      if (altKey) {
         path.push("altKey")
      }
      if (ctrlKey) {
         path.push("ctrlKey")
      }
      if (shiftKey) {
         path.push("shiftKey")
      }
      path.push(key.toLocaleLowerCase())
      let _behavior = getIn(this._behavior, path);
      if (_behavior) {
         stopEvent(event);
         if (typeof _behavior === "function") {
            dispatch(_behavior())
         } else if (typeof _behavior === "object" && _behavior.type) {
            dispatch(_behavior)
         }
      }
   }
   render() {
      return (
         <React.Fragment>
            <EventListener target="window" onKeyDown={this.handleKeyDown} />
            {
               this.props.children || null
            }
         </React.Fragment>
      )
   }
}