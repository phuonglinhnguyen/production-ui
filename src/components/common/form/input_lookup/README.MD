*Version:v2*

Properties:
- field: It's value of field defined
- tabIndex: none required
- autoFocus: default is 'false'
- onUpdateInput: Callback function that is fired when the user updates the TextField. *Signature:* function(value:String, eventElemment:{source:['change','select','change_by_broadcast' ]}, event:NativeEventReact)
- broadcastChannel: Channel of record effect update of field.
- autoScroll:Type [boolean], need autoScroll to position defined when this node called node.focus().
- scrollTo : default = {
            top: 0,
            left: 0.5,
            leftOffset: 0,
            topOffset: 150
        }. Defined scroll to position when used autoScroll.  
- onFocus : function(event:EventNativeReact){}. Callback function fired when the InputLook focused.
- onBlur: function(event:EventNativeReact). Callback function fired when this is blur.
- onOpen: function(isOpen:boolean), Callback function fired when popover lookup is open or close. Ex: use for lock scroll.

    
