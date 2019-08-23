
import * as React from 'react';
import Button from '@material-ui/core/Button';
import CommentIcon from '@material-ui/icons/Comment';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { isEqual } from 'lodash'
type Props = {||};

class HoldInfo extends React.Component<Props> {
   constructor(props: Props) {
      super(props);
      this.state = {
         open: false,
         show_comment: []
      }
   }

   componentWillMount() {

   }

   componentDidMount() {

   }

   componentWillReceiveProps(nextProps: Props) {
      if(!isEqual(this.props,nextProps)){
         if(nextProps.infoWord.rework||nextProps.infoWord.comment){
            const { infoWord: { comment, rework, rework_comment } } = nextProps;
            this.setState({
               open: true,
               show_comment: rework ? rework_comment.split('#EOL#') : comment.split('#EOL#') //rework_comment.replace(/#EOL#/g, '\n') : comment.replace(/#EOL#/g, '\n')
            })
         }
      }
   }
     
     

   // shouldComponentUpdate(nextProps: Props, nextState: TM_STATE_TYPE) {

   // }

   componentWillUpdate(nextProps: Props, nextState: TM_STATE_TYPE) {

   }

   componentDidUpdate(prevProps: Props, prevState: TM_STATE_TYPE) {

   }

   componentWillUnmount() {

   }
   handleShowDialog = () => {
      const { infoWord: { comment, rework, rework_comment } } = this.props;
      this.setState({
         open: true,
         show_comment: rework ? rework_comment.split('#EOL#') : comment.split('#EOL#') //rework_comment.replace(/#EOL#/g, '\n') : comment.replace(/#EOL#/g, '\n')
      })
   }
   handleClose = () => {
      this.setState({
         open: false,
      })
   }
   renderDiaglog = () => {
      const { infoWord: { comment, rework } } = this.props;
      const { open, show_comment } = this.state;
      function Transition(props) {
         return <Slide direction="down" {...props} />;
      }
    
      return (
         <Dialog
            open={this.state.open}
            // TransitionComponent={Transition}
            // keepMounted
            scroll="paper"
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
         >
            <DialogTitle id="alert-dialog-slide-title">
               {rework ? "REWORK" : "COMMENT"}
            </DialogTitle>
            <DialogContent>
               <DialogContentText id="alert-dialog-slide-description">
                   <ul style={{
                     minWidth: 500,
                     listStyle: 'none',
                     paddingLeft: 0
                  }}>
                     {show_comment.map((item,idKey) => {
                        let [username, ..._ms] = item.split(':')
                        return (
                           <li key={idKey} style={{ margin: "12px 0px" }} >
                              <span style={{ fontSize: "16px", color: "red", display: "inline-block", width: "100%", position: "relative" }} >{username}
                                 <div style={{
                                    content: " ",
                                    height: 1,
                                    width: 200,
                                    background: 'linear-gradient(90deg,#646464 0,rgba(85,85,85,0))',
                                    position: 'absolute',
                                    left: -2
                                 }} />
                              </span>
                              <span style={{ fontSize: "0.9em", color: "rgba(0,0,0,0.8)" }}>{_ms.join(":")}</span>
                           </li>
                        )
                     })}
                  </ul> 
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button onClick={this.handleClose} color="primary">
                  CLOSE
            </Button>
            </DialogActions>
         </Dialog>
      )
   }
   render() {
      const { infoWord } = this.props;
      const { comment,
         hold_count,
         rework,
      } = infoWord;
      if (Boolean(comment)) {
         return (
            <React.Fragment>
               <Button onClick={this.handleShowDialog}>
                  Hold: {hold_count}
                  <CommentIcon style={{ marginLeft: 8 }} />
               </Button>
               {this.renderDiaglog()}
            </React.Fragment>
         );
      } else if (rework) {
         return (
            <React.Fragment>
               <Button onClick={this.handleShowDialog}>
                  Rework
                  <CommentIcon style={{ marginLeft: 8 }} />
               </Button>
               {this.renderDiaglog()}
            </React.Fragment>
         );
      } else {
         return '';
      }
   }
}

export default HoldInfo;