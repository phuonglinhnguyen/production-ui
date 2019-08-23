import * as React from 'react';
import { MainController, WRAPPER, STAGES, RectangleStyles, RectangleSelect, FEATURES, TRIGGER_DRAW_POYLILINES } from '@dgtx/su-viewer'
import { isEqual } from 'lodash'
import ToolBar from './tool_bar'
import EventListener from 'react-event-listener';
import { getState, setState } from './StateViewer';
import './viewer.css'
const cancelEvent = (event) => {
  event.preventDefault();
  event.stopPropagation();
}

const RenderView = React.memo((props) => {
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
})
export default class IViewer extends React.Component {
  static defaultProps = {
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
    onChangeRatio: function onChangeRatio() {
      return undefined;
    },
    onViewPage: function onViewPage() {
      return undefined;
    }
  };
  constructor(props: IAppProps) {
    super(props);
    this.mainController = new MainController(this);
    // this._wrapper = React.createRef();
    this.mainController.addListener('scroll', setState)
    this.mainController.addListener('rotate', setState)
    this.mainController.addListener('ratio', setState)
  }
  _addRef = (name) => (node) => {
    this.mainController.setElement(name, node);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data && !isEqual(this.props.data, nextProps.data)) {
      this.mainController.loadDatum(nextProps.data);
      if (getState()) {
        this.mainController.setState(getState());
      }
    }
    if (!isEqual(nextProps.highlightPolygons, this.props.highlightPolygons)) {
      this.mainController.sethighlightPolygons(nextProps.highlightPolygons || []);
    }
    if (!isEqual(nextProps.wordStylesDefault, this.props.wordStylesDefault) || !isEqual(nextProps.wordStylesHover, this.props.wordStylesHover) || !isEqual(nextProps.wordStylesSelect, this.props.wordStylesSelect)) {
      var rectangeWordStyle = {
        default: Object.assign({}, RectangleStyles.default.default, nextProps.wordStylesDefault || {}),
        hover: Object.assign({}, RectangleStyles.default.hover, nextProps.wordStylesHover || {}),
        select: Object.assign({}, RectangleStyles.default.select, nextProps.wordStylesSelect || {})
      };
      this.mainController.setWordStyle(rectangeWordStyle);
    }
    if (!isEqual(nextProps.config, this.props.config)) {
      this.renderConfig(nextProps.config)
    }
  }
  shouldComponentUpdate = (nextProps, nextState) => {
    let shouldUpdate = !isEqual(this.props.width, nextProps.width)
      || !isEqual(this.props.height, nextProps.height)
    // || !isEqual(this.props.highlightPolygons, nextProps.highlightPolygons);
    return shouldUpdate;
  }
  handleOnMouseClick = (event) => {
    cancelEvent(event)
  }
  handleOnMouseDown = (event) => {
    cancelEvent(event)
  }
  componentDidMount = () => {
    // if (this.props.ratio) {
    //   this.mainController.setRatio(this.props.ratio);
    // }
    this._wrapper.addEventListener("mousedown", this.handleOnMouseDown, false);
    if (this.props.data) {
      this.mainController.loadDatum(this.props.data);
      if (getState()) {
        this.mainController.setState(getState());
      }
    }
    var rectangeWordStyle = {
      default: Object.assign({}, RectangleStyles.default.default, this.props.wordStylesDefault || {}),
      hover: Object.assign({}, RectangleStyles.default.hover, this.props.wordStylesHover || {}),
      select: Object.assign({}, RectangleStyles.default.select, this.props.wordStylesSelect || {})
    };
    this.mainController.setWordStyle(rectangeWordStyle);
    this.mainController.sethighlightPolygons(this.props.highlightPolygons);
    this.renderConfig(this.props.config);
  }
  componentWillUnmount = () => {
    this._wrapper.removeEventListener("mousedown", this.handleOnMouseDown, false)
  }
  componentDidUpdate = () => {
    this.mainController.render();
  }
  renderConfig = (config) => {
    let { focusField, focusLine, draw, pageId, current, single, sections, rotate = 0, field, draw_poly } = config;
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
    this.mainController.setRotate(0, rotate)
    if (draw_poly) {
      this.mainController.activeFeatures([FEATURES.DRAW_POLY]);
      this.mainController.setData(TRIGGER_DRAW_POYLILINES
        .EDIT, true)
      this.mainController.setData(TRIGGER_DRAW_POYLILINES.ADD, true)
    } else {
      this.mainController.deActiveFeatures([FEATURES.DRAW_POLY]);
    }
    if (single) {
      if (this.mainController.getStatusFeature()[FEATURES.SECTION_LINES] === 'active') {
        this.mainController.setData("section", dataNone)
        this.mainController.deActiveFeatures([FEATURES.SECTION_LINES])
      }
      if (this.mainController.getStatusFeature()[FEATURES.FIELD_FOCUS] !== 'active') {
        this.mainController.activeFeatures([FEATURES.FIELD_FOCUS]);
      }
      this.mainController.setData("field", data)
    } else {
      if (this.mainController.getStatusFeature()[FEATURES.FIELD_FOCUS] === 'active') {
        this.mainController.setData("field", dataNone)
        this.mainController.deActiveFeatures([FEATURES.FIELD_FOCUS]);
      }
      if (this.mainController.getStatusFeature()[FEATURES.SECTION_LINES] !== 'active') {
        this.mainController.activeFeatures([FEATURES.SECTION_LINES])
      }
      this.mainController.setData("section", data)
    }
  }

  handleKeyDown = (event) => {
    if (event.altKey) {
      switch (event.code) {
        case 'ArrowLeft':
          cancelEvent(event);
          this.mainController.setData('move', {
            type: 'left',
            payload: 20
          })
          break;

        case 'ArrowRight':
          cancelEvent(event);
          this.mainController.setData('move', {
            type: 'right',
            payload: 20
          })
          break;
        case 'ArrowUp':
          cancelEvent(event);
          this.mainController.setData('move', {
            type: 'down',
            payload: 20
          })
          break;
        case 'ArrowDown':
          cancelEvent(event);
          this.mainController.setData('move', {
            type: 'up',
            payload: 20
          })
          break;
        default:

          break;
      }
    }
  }
  render() {
    const {
      width,
      height,
      wrapperStyle
    } = this.props;
    let _wrapperStyle = Object.assign({}, { backgroundColor: '#404040' }, wrapperStyle);
    return (
      <RenderView
        registerRef={this._addRef}
        setRefWrap={node => this._wrapper = node}
        onKeyDown={this.handleKeyDown}
        width={width}
        height={height}
        wrapperStyle={_wrapperStyle}
      />
    )
    // return (
    //   <div ref={this._wrapper} style={{ width, height, position: 'relative', ..._wrapperStyle }}>
    //     <EventListener target="window" onKeyDown={this.handleKeyDown} />
    //     <div ref={this._addRef(WRAPPER)} style={{ width, height, position: 'relative', }}>
    //       <canvas ref={this._addRef(STAGES.IMAGE)} width={width} height={height} className='viewer-canvas' />
    //       <canvas ref={this._addRef(STAGES.DATUM)} width={width} height={height} className='viewer-canvas' />
    //       <canvas ref={this._addRef(STAGES.DRAW)} width={width} height={height} className='viewer-canvas' />
    //       <canvas ref={this._addRef(STAGES.EVENT)} width={width} height={height} className='viewer-canvas' />
    //     </div>
    //   </div>
    // );
  }
}


// const RenderView =React.memo((props)=>{
//   const {
//     registerRef,
//     setRefWrap ,
//     onKeyDown , 
//     width ,
//     height,
//     wrapperStyle={}
//   } = props;

//   return (
//     <div ref={setRefWrap} style={{ width, height, position: 'relative', ...wrapperStyle }}>
//     <EventListener target="window" onKeyDown={onKeyDown} />
//     <div ref={registerRef(WRAPPER)} style={{ width, height, position: 'relative', }}>
//       <canvas ref={registerRef(STAGES.IMAGE)} width={width} height={height} className='viewer-canvas' />
//       <canvas ref={registerRef(STAGES.DATUM)} width={width} height={height} className='viewer-canvas' />
//       <canvas ref={registerRef(STAGES.DRAW)} width={width} height={height} className='viewer-canvas' />
//       <canvas ref={registerRef(STAGES.EVENT)} width={width} height={height} className='viewer-canvas' />
//     </div>
//   </div>
//   )
// })