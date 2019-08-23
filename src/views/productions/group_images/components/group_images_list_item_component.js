import React from "react";

import { Card, CardMedia, CardText } from "material-ui/Card";

import CircularProgress from 'material-ui/CircularProgress';

// const styles = {
//   main: {
//     flex: "0 0 70%",
//     position: "relative"
//   }
// };

let timeoutId = 0;
class GroupImagesListItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleDbClick = this.handleDbClick.bind(this);
  }

  handleClick() {
    const { index, action_click } = this.props;

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      action_click(index);
    }, 200);
  }

  handleDbClick() {
    const { image_s3, action_showCanvas, image_name } = this.props;

    clearTimeout(timeoutId);

    action_showCanvas(image_name, image_s3);
  }

  render() {
    const { index, is_checked, primary1Color, image_s3, image_name, loading } = this.props;

    return (
      <Card
        style={{
          height: 350
        }}
        onDoubleClick={this.handleDbClick}
        onClick={this.handleClick}
      >
        <CardMedia>
          {loading ?
            <div style={{
              minHeight: 300,
              maxHeight: 300,
              maxWidth: 300,
              minWidth: 300
            }}>
              <CircularProgress size={60} thickness={7} />
            </div>
            :
            <img
              id={`classify_img_${index}`}
              style={{
                minHeight: 300,
                maxHeight: 300,
                maxWidth: 300,
                minWidth: 300
              }}
              src={image_s3 + "?action=thumbnail&width=150"}
              alt="Error"
            />
          }
        </CardMedia>
        <CardText
          style={{
            height: 12,
            padding: 19,
            backgroundColor: is_checked ? primary1Color : "",
            color: is_checked ? "#FFFFFF" : ""
          }}
        >
          {`${index + 1}. ${image_name}`}
        </CardText>
      </Card>
    );
  }
}

export default GroupImagesListItem;
