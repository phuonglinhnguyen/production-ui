import React ,{Component} from "react";

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table";
import RaisedButton from "material-ui/RaisedButton";
import { isEqual } from 'lodash'
import ExpandMoreIcon from "material-ui/svg-icons/navigation/expand-more";
import ExpandLessIcon from "material-ui/svg-icons/navigation/expand-less";

const styles = {
  main: {
    position: "fixed",
    height: 38,
    zIndex: 10,
    bottom: -22,
    width: 122,
    left: "calc(50% - 66px)"
  },
  table: {
    height: 400,
    width: "100%",
    position: "fixed",
    bottom: 0,
    zIndex:1000,
  }
};

class RecordComponent extends Component {
  state = {
    bottom: -22
  };
  shouldComponentUpdate(nextProps, nextState) {
    let showRecord =!isEqual(this.props.showRecord,nextProps.showRecord);
    let records =!isEqual(this.props.records,nextProps.records);
    let recordsChecked =!isEqual(this.props.recordsChecked,nextProps.recordsChecked);
    let record_selecting =!isEqual(this.props.record_selecting,nextProps.record_selecting);
    let fields =!isEqual(this.props.fields,nextProps.fields);
    let shouldUpdate =showRecord||records||recordsChecked||record_selecting||fields
    return shouldUpdate;
  }
  handleRowSelection = (selectedRows) => {
   const {selectRecord} = this.props;
   if(selectedRows.length){
     selectRecord(selectedRows[0])
   }
  };
  isSelected = (index) => {
    return this.props.record_selecting===index;
  };
  render() {
    const {records ,showRecord , 
      recordsChecked,record_selecting,
      record_input=[],
      setViewRecords, fields=[]}=this.props;
      let dataRender=[]
      if(record_input.length>0){
        dataRender =records.map((record,index)=>
        {
          return {
            index,
            style: !record_input[index]?(recordsChecked.indexOf(index)>-1?{background:'rgba(232, 152, 12,0.6)'}:{background:'rgba(255, 236, 104,0.9)'}):recordsChecked.indexOf(index)>-1?{background:'rgba(0, 188, 212,0.1)'}:{},
            selected:record_selecting===index,
            values:fields.map(field=>record[field.name]||'')
          }
        })
      }else{
        dataRender =records.map((record,index)=>
        {
          return {
            index,
            style: recordsChecked.indexOf(index)>-1?{background:'rgba(0, 188, 212,0.1)'}:{},
            selected:record_selecting===index,
            values:fields.map(field=>record[field.name]||'')
          }
        })

      }
      
    if (!showRecord) {
      return (
        <div
          onMouseEnter={() => this.setState({ bottom: 0 })}
          onMouseLeave={() => this.setState({ bottom: -22 })}
          style={{ ...styles.main, bottom: this.state.bottom }}
        >
          <RaisedButton
            label="Records"
            primary={true}
            icon={<ExpandLessIcon />}
            onClick={() => {
              setViewRecords(!showRecord)
              this.setState({ bottom: -22 })}
            }
          />
        </div>
      );
    }
    let cellWidth =250;
    let dataRenderEl = (
      <div style={styles.table}>
        <div
          style={{
            width: 122,
            margin: "auto",
            
          }}
        >
          <RaisedButton
            label="Records"
            primary={true}
            icon={<ExpandMoreIcon />}
            onClick={() => setViewRecords(!showRecord)}
          />
        </div>
        <div
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.16) 0px 0px 5px, rgba(0, 0, 0, 0.23) 0px -5px 7px",
            overflow:'hidden',
            width:'100vw'
          }}
        >
          <Table
            height="290px"
            bodyStyle={{ backgroundColor: "#FFFFFF",width:fields.length * cellWidth }}
            headerStyle={{ backgroundColor: "#FFFFFF",width:fields.length * cellWidth }}
            fixedHeader={true}
            onRowSelection={this.handleRowSelection}
          >
            <TableHeader style={{with:fields.length * cellWidth}}>
              <TableRow >
                <TableHeaderColumn style={{width:25}}>ID</TableHeaderColumn>
                {fields.map(field=>(
                  <TableHeaderColumn key={`item-header-${field.name}`}>{field.field_display}</TableHeaderColumn>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody deselectOnClickaway={false} >
                {dataRender.map((record)=>(
                  <TableRow  key={`record-index-${record.index}`} 
                    style={record.style}
                   selected={record.selected}>
                    <TableRowColumn style={{width:25}}>{record.index+1}</TableRowColumn>
                    {record.values.map((value,index)=>(
                    <TableRowColumn  key={`record-index-${record.index}-${index}`} >{value}</TableRowColumn>
                  ))}
                </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
    return dataRenderEl
  }
}

export default RecordComponent;
