import React from 'react'
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ActionInfo from 'material-ui/svg-icons/action/info'
const shortcuts =[
  {title:"Hold task",key:'Alt + H'},
  {title:"Thêm 'Record'",key:'Alt + ( + )'},
  {title:"Xóa 'Record'",key:'Alt + ( - )'},
  {title:"Copy giá trị của 'Field' thuộc 'Record' trước",key:'F5'},
  {title:"Di Chuyển 'Record' trên lưới lên trên",key:'Alt + NumLock 8'},
  {title:"Di Chuyển 'Record' trên lưới xuống dưới",key:'Alt + NumLock 2'},
  {title:"Cập nhật dữ liệu vào lưới",key:'Alt + U'},
  {title:"Cập nhật dữ liệu và qua 'Record' kế tiếp",key:'Alt + N'},
  {title:"Cập nhật dữ liệu và qua 'Record' trước",key:'Alt + B'},
  {title:"Save task",key:'Alt + S'}, /**@description change hotkey save data 's' to 'l'  by request dung_mama*/
  {title:"Save khi chắc chắn làm xong task",key:'Ctrl + Shift + S'},
  // {title:"",key:''},
]

export const InfoShortCut = () => {
    return(
    <IconMenu
      iconButtonElement={<IconButton tooltip='Shortcut'><ActionInfo /></IconButton>}
      anchorOrigin={{horizontal: 'left', vertical: 'top'}}
      targetOrigin={{horizontal: 'left', vertical: 'bottom'}}
      maxHeight={550}
      menuStyle={{width:500}}
    >
    {shortcuts.map((shortcut,index)=><MenuItem key={`shortcut-item-${index}`} primaryText={shortcut.title} secondaryText={shortcut.key} />)
    }
    </IconMenu>
    )
}

export default InfoShortCut