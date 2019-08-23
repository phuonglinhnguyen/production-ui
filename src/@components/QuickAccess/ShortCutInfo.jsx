import React from 'react'
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ActionInfo from '@material-ui/icons/Info'

const shortcuts = [
   { title: "Hold task", key: 'Alt + H' },
   { title: "Thêm 'Record'", key: 'Alt + ( + )' },
   { title: "Xóa 'Record'", key: 'Alt + ( - )' },
   { title: "Copy giá trị của 'Field' thuộc 'Record' trước", key: 'F5' },
   { title: "Di Chuyển 'Record' trên lưới lên trên", key: 'Alt + NumLock 8' },
   { title: "Di Chuyển 'Record' trên lưới xuống dưới", key: 'Alt + NumLock 2' },
   { title: "Cập nhật dữ liệu vào lưới", key: 'Alt + U' },
   { title: "Cập nhật dữ liệu và qua 'Record' kế tiếp", key: 'Alt + N' },
   { title: "Cập nhật dữ liệu và qua 'Record' trước", key: 'Alt + B' },
   { title: "Save task", key: 'Alt + S' }, /**@description change hotkey save data 's' to 'l'  by request dung_mama*/
   // { title: "Save khi chắc chắn làm xong task", key: 'Ctrl + Shift + S' },
   // {title:"",key:''},
]

class InfoShortCut extends React.Component {
   state = {
      anchorEl: null,
   };

   handleClick = event => {
      this.setState({ anchorEl: event.currentTarget });
   };

   handleClose = () => {
      this.setState({ anchorEl: null });
   };
   render() {
      const { anchorEl } = this.state;
      const open = Boolean(anchorEl);
      return (
         <React.Fragment>
            <IconButton
               aria-label="More"
               aria-owns={open ? 'long-menu' : undefined}
               aria-haspopup="true"
               color="inherit"
               onClick={this.handleClick}
            >
               <ActionInfo />
            </IconButton>
            <Menu
               id="long-menu"
               anchorEl={anchorEl}
               open={open}
               onClose={this.handleClose}
               PaperProps={{
                  style: {
                     maxHeight: 48 * (shortcuts.length + 1),
                     width: 550,
                  },
               }}
            >
               {shortcuts.map((shortcut, index) => (
                  <MenuItem key={index} onClick={this.handleClose}>
                     {shortcut.title}
                     <span style={{right:10, position:'absolute'}}>
                        {shortcut.key}
                     </span>
                  </MenuItem>
               ))}
            </Menu>
         </React.Fragment>
      )
   }
}


export default InfoShortCut