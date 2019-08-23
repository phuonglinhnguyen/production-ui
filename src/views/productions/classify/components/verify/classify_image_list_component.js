import React from "react";
import ReactDOM from "react-dom";

import { GridList } from "material-ui/GridList";

import ClassifyImageCanvas from "./classify_image_canvas_component";
import ClassifyImageListLargeItem from "./classify_image_list_large_item_component";
import ClassifyImageListMiniItem from "./classify_image_list_mini_item_component";
import { getIndexItem } from "../../common/handle_keydown";

import _ from "lodash";

const styles = {
  main: {
    height: "100%"
  },
  gridList: {
    margin: 0,
    overflow: "auto",
    maxHeight: "calc(100vh - 126px)",
    paddingTop: 2,
    paddingRight: 2
  }
};
class ClassifyImageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width_item: 0
    };
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleKeyDown(event) {
    const {
      cols,
      show_canvas,
      selected_index_document,
      data_tasks_length
    } = this.props;

    const tag = event.target.id.toLowerCase();

    if (tag === "text_search_layout") {
      return;
    }
    let keyCode = event.keyCode;
    if (keyCode === 9) {
      if (event.shiftKey) {
        keyCode = 37;
      } else {
        keyCode = 39;
      }
    }

    if (keyCode === 27 && show_canvas) {
      this.props.action_hideDocSelected();
      return;
    }

    if (keyCode === 13 && !show_canvas && selected_index_document > -1) {
      this.props.action_showDocSelected(selected_index_document);
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    if (
      (show_canvas && (keyCode === 37 || keyCode === 39)) ||
      (!show_canvas && keyCode > 36 && keyCode < 41)
    ) {
      this.handleClick(
        getIndexItem(selected_index_document, cols, keyCode, data_tasks_length)
      );
    }

    if (event.keyCode === 9) {
      event.preventDefault();
    }
  }

  changeCardColor(i, textColor, backgroundColor) {
    const node_card = ReactDOM.findDOMNode(this.refs[`image_${i}`]);
    node_card.style.backgroundColor = backgroundColor;
    const node_card_title = ReactDOM.findDOMNode(
      this.refs[`image_${i}`].refs["title"]
    );
    node_card_title.style.color = textColor;

    return node_card;
  }

  handleClick(i) {
    const {
      show_canvas,
      action_showDocSelected,
      action_selectIndexDocument
    } = this.props;

    const node = ReactDOM.findDOMNode(this.refs[`image_${i}`]);
    if (node) {
      node.scrollIntoView({
        block: "start",
        behavior: "smooth"
      });
    }

    document.getElementById(`classify_table_${i}`).scrollIntoView({
      block: "start",
      behavior: "smooth"
    });

    if (!show_canvas) {
      action_selectIndexDocument(i);
    } else {
      action_showDocSelected(i);
    }
  }

  componentDidMount() {
    this.setState({
      width_item:
        ReactDOM.findDOMNode(this).parentNode.offsetWidth / this.props.cols - 20
    });
    if (this.props.data_tasks_length > 0) {
      this.handleClick(0);
    }
  }

  componentWillMount() {
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps);
  }

  render() {
    const {
      show_canvas,
      primary1Color,
      accent1Color,
      textColor,
      is_display_list,
      cols,
      height_item,
      selected_document,
      selected_index_document,
      data_tasks,
      data_tasks_length,
      action_hideDocSelected,
      action_showDocSelected
    } = this.props;
    const { width_item } = this.state;
      
    let body_list = null;
    if (is_display_list) {
      body_list = data_tasks.map((data, i) => (
        <ClassifyImageListMiniItem
          key={i}
          index={i}
          textColor={textColor}
          primary1Color={primary1Color}
          accent1Color={accent1Color}
          approved={data.approved}
          selected_index_document={selected_index_document}
          layout_name={data.layout_name}
          ref={`image_${i}`}
          handleClick={this.handleClick}
          action_showDocSelected={action_showDocSelected}
        />
      ));
    } else if (!show_canvas && width_item > 0) {
      body_list = data_tasks.map((data, i) => (
        <ClassifyImageListLargeItem
          key={i}
          index={i}
          textColor={textColor}
          primary1Color={primary1Color}
          accent1Color={accent1Color}
          selected_index_document={selected_index_document}
          s2_url={data.s2_url}
          layout_name={data.layout_name}
          approved={data.approved}
          width={width_item}
          height={height_item}
          ref={`image_${i}`}
          handleClick={this.handleClick}
          action_showDocSelected={action_showDocSelected}
        />
      ));
    }

    return (
      <div style={styles.main}>
        {/* <Toolbar style={{ backgroundColor: background4Color }}>
          <ToolbarGroup firstChild={true} />
          <ToolbarGroup>
            {is_display_list ? (
              <IconButton
                hoveredStyle={{ zIndex: 2 }}
                tooltip="Grid View"
                onClick={() => action_changeDisplayType("grid")}
              >
                <IconViewModule />
              </IconButton>
            ) : (
              <IconButton
                hoveredStyle={{ zIndex: 2 }}
                tooltip="List View"
                onClick={() => action_changeDisplayType("list")}
              >
                <IconViewList />
              </IconButton>
            )}
          </ToolbarGroup>
        </Toolbar> */}
        <GridList
          style={styles.gridList}
          padding={4}
          cols={cols}
          cellHeight={height_item}
        >
          {body_list}
        </GridList>
        <ClassifyImageCanvas
          cols={cols}
          show_canvas={show_canvas}
          primary1Color={primary1Color}
          selected_document={selected_document}
          selected_index_document={selected_index_document}
          action_hideDocSelected={action_hideDocSelected}
          data_tasks_length={data_tasks_length}
          handleClick={this.handleClick}
        />
      </div>
    );
  }
}
export default ClassifyImageList;
