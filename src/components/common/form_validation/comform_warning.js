import React,{Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

const tableStyle ={
    recordColumnStyle:{ width:'calc(64px)'},
    fieldColumnStyle:{ width: 'calc(26% - 64px)'},
    valueColumnStyle:{ width: 'calc(30%)'},
    messageColumnStyle:{ width: 'calc(40%)'},
}
export default class Class extends Component {
    state={
        warningArray:[],
        index_selecting:0,
    }
    componentWillReceiveProps(nextProps) {
        const {warningMap, indexRecord}  =nextProps;
        let warningArray=[];
            let recordData = warningMap[indexRecord]
        if(recordData)
            Object.keys(recordData).sort().forEach(fieldName => {
                let warningField = recordData[fieldName];
                warningField.warnings.forEach(mss => {
                    warningArray.push({
                        ignore:false,
                        fieldName,
                        value: warningField.value,
                        message: mss,
                    })
                })
            })
        this.setState({warningArray,index_selecting:0})

    }
    getDisplayByName=(name)=>{
        const {fieldsValidation}=this.props;
        let field = fieldsValidation.filter(item=> item.name===name)[0];
        if(field){
            return field.field_display
        }
        return name
    }
    getBodyComform = () => {
        const self = this;
        let result =[];
        this.state.warningArray.forEach((item,index)=>{
            result.push(
                <TableRow key = {`item-warning-${item.recordIndex}-${item.fieldName}-${item.value}-${item.message.message}`} 
                selected = {this.state.index_selecting===index}
                >
                    <TableRowColumn style={tableStyle.recordColumnStyle} > {item.ignore?'IGNORE':'WARNING'}</TableRowColumn> 
                    <TableRowColumn style={tableStyle.fieldColumnStyle}>{self.getDisplayByName(item.fieldName)}</TableRowColumn> 
                    <TableRowColumn style={tableStyle.valueColumnStyle}>{item.value}</TableRowColumn>
                    <TableRowColumn style={tableStyle.messageColumnStyle}>{item.message.message}</TableRowColumn>
                </TableRow>
            )
        })
        return result;
    }
    handleIgnore=(event)=>{
        const {closeDialog} = this.props;
        let  {warningArray,index_selecting} = this.state; 
        warningArray[index_selecting].ignore = true;
        if(index_selecting < warningArray.length-1){
            this.setState({index_selecting:this.state.index_selecting+1,warningArray:warningArray})
        }else{
            closeDialog(warningArray) 
        }
        event.preventDefault();
    }
    _addRef=(node)=>{
        this.btn = node;
    }    
    handleClose=()=>{
        const {closeDialog} = this.props;
        closeDialog(this.state.warningArray)
    }
    render() {
        const {open} =this.props;
        return (
                <Dialog
                title = "WARNING"
                actions = {
                    [ <FlatButton
                        label = "CANCEL"
                        onClick = {this.handleClose}/>,
                      <FlatButton
                        label = "IGNORE"
                        primary = {true}
                        ref={this._addRef}
                        keyboardFocused = {true}
                        onClick = {this.handleIgnore}/>,
                    ]
                }
                contentStyle={{width: 'calc(80%)',maxWidth: '1200px'}}
                modal = {
                    false
                }
                open = {open}
                onRequestClose = {this.handleClose} >
                <Table 
                height = "369px"
                bodyStyle = {{backgroundColor: "#FFFFFF"}}
                fixedHeader = {true}
                >
                    <TableHeader enableSelectAll={false} displaySelectAll={false}
            adjustForCheckbox={false} >
                        <TableRow>
                            <TableHeaderColumn style={tableStyle.recordColumnStyle}>Status</TableHeaderColumn>
                            <TableHeaderColumn style={tableStyle.fieldColumnStyle}>Field</TableHeaderColumn> 
                            <TableHeaderColumn style={tableStyle.valueColumnStyle}>Value</TableHeaderColumn> 
                            <TableHeaderColumn style={tableStyle.messageColumnStyle}>Message</TableHeaderColumn>
                        </TableRow> 
                    </TableHeader>
                        <TableBody  displayRowCheckbox={false}>
                            {this.getBodyComform()} 
                        </TableBody> 
                    </Table>
                    </Dialog>
        );
    }
}