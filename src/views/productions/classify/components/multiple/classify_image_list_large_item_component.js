import React from "react";

import { Card, CardMedia, CardText } from "material-ui/Card";

class ClassifyImageListItem extends React.PureComponent {

  render() {
    const {
      index,
      height,
      s2_url,
      layout_name,
      textColor,
      primary1Color,
      selected_index_document,
      handleClick,
      action_showDocSelected
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
        <CardMedia>
          <img
            id={`classify_img_${index}`}
            style={{
              height: height - 56,
              minHeight: height - 56,
              border: "none",
              backgroundColor: "black"
            }}
            src={`${s2_url}?action=thumbnail&width=800`}
            alt="Error"
          />
        </CardMedia>
        <CardText
          style={{
            height: 15,
            color: selected_index_document === index ? "#FFFFFF" : textColor
          }}
        >
          {index + 1}. {layout_name}
        </CardText>
      </Card>
    );
  }
}
export default ClassifyImageListItem;
