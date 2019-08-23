import React from "react";
import TextField from "material-ui/TextField";
import ChipListSelected from "../single/classify_data_layout_list_component";
import Subheader from "material-ui/Subheader";
import { Translate } from 'react-redux-i18n'
import _ from "lodash";
import { grey700, darkBlack, lightBlack } from 'material-ui/styles/colors';
import { Divider } from "material-ui";
let str_keypress = "";
let timeoutId = 0;

class ClassifyDataLayoutList extends React.Component {
  constructor(props) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown(event) {
    clearTimeout(timeoutId); // doesn't matter if it's 0
    let keyCode = event.keyCode;
    if (keyCode > 95 && keyCode < 106) {
      keyCode = keyCode - 48;
    }

    const layout_definitions = this.props.layout_definitions;
    if (keyCode > 47 && keyCode < 59) {
      const tag = event.target.id.toLowerCase();
      if (tag === "text_search_layout") {
        return;
      }
      str_keypress += String.fromCharCode(keyCode);
      timeoutId = setTimeout(() => {
        const layout = layout_definitions.find(l => l.hot_key === str_keypress);
        this.props.action_selectLayoutDefinition(layout);
        str_keypress = "";
      }, 300);
    } else if (keyCode === 65 && event.altKey) {
      this.props.action_selectLayoutDefinition(null, true);
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

  handleChange(event) {
    this.props.action_setTextSearch(event.target.value);

    clearTimeout(timeoutId); // doesn't matter if it's 0

    timeoutId = setTimeout(() => {
      this.props.action_filterLayoutDefinitions(
        this.props.text_search,
        this.props.layout_definitions
      );
    }, 200);
  }

  render() {
    const {
      primary1Color,
      selected_layout_definition,
      text_search,
      layout_definitions = [],
      data_tasks,
      selected_index_document,
      action_selectLayoutDefinition
    } = this.props;
    let task = data_tasks[selected_index_document];
    return (
      <div>
        <Subheader>Comments</Subheader>
        <div className='cool_scroll_smart' style={{width:'100%',height:'150px'
        ,overflowY:'auto'}}> 
          <TextField
            fullWidth={true}
            multiLine={true}
            value={task.comment}
            underlineShow={false}
          />
        </div>
        <Divider />
        <Subheader>Layouts</Subheader>
        <ChipListSelected
          ref="chip_list"
          selected_layout_definition={selected_layout_definition}
          action_selectLayoutDefinition={action_selectLayoutDefinition}
          layout_definitions={layout_definitions}
          primary1Color={primary1Color}
        />
      </div>
    );
  }
}

export default ClassifyDataLayoutList;
