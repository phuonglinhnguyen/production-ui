import React from "react";

import { Card, CardMedia, CardText, CardTitle } from "material-ui/Card";
import MessageIcon from 'material-ui/svg-icons/communication/message';
import IconButton from 'material-ui/IconButton'
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
      action_showDocSelected,
      layoutNameOld,
      comment

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
        <CardMedia
          overlay={<CardTitle
            style={{ color: 'red' }}
            subtitle={layoutNameOld}
          />
          }
        >
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
            color: selected_index_document === index ? "#FFFFFF" : textColor,
            position: 'relative',
          }}
        >
          {index + 1}. {layout_name}
         {comment&&comment.length&&<div style={{
            position: 'absolute',
            bottom: 0,
            right: 12,
            zIndex: 100
          }}>
            <IconButton>
              <MessageIcon />
            </IconButton>
          </div>}
        </CardText>
      </Card>
    );
  }
}
export default ClassifyImageListItem;
