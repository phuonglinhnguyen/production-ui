import React from "react";

import { Card, CardText } from "material-ui/Card";

import _ from "lodash";

class ClassifyImageListItem extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps);
  }

  render() {
    const {
      index,
      layout_name,
      textColor,
      primary1Color,
      selected_index_document,
      handleClick,
      action_showDocSelected,
      layoutNameOld,
      comment,
    } = this.props;
    
    return (
      <Card
        style={{
          backgroundColor:
            selected_index_document === index ? primary1Color : "#FFFFFF"
        }}
        onDoubleClick={() => action_showDocSelected(index)}
        onClick={() => handleClick(index)}
      >
        <CardText
          style={{
            height: 15,
            padding: "22px 16px 10px 16px",
            color: selected_index_document === index ? "#FFFFFF" : textColor
          }}
        >
          <div id={`classify_img_${index}`}>
            {index + 1}. {layout_name}
          </div>
          {layoutNameOld}
        </CardText>
      </Card>
    );
  }
}
export default ClassifyImageListItem;
