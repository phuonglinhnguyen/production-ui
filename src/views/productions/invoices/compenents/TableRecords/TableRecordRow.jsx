// @flow strict

import * as React from 'react';
import {
   Paper,
   Typography,
   TextField,
   Button,
   Table,
   TableHead,
   TableRow,
   TableCell, TableBody,
} from '@material-ui/core'
type Props = {||};

class TableRecordRow extends React.Component<Props> {
   constructor(props: Props) {
      super(props);

   }

   componentWillMount() {

   }

   componentDidMount() {

   }

   componentWillReceiveProps(nextProps: Props) {

   }

   // shouldComponentUpdate(nextProps: Props, nextState: TM_STATE_TYPE) {

   // }

   componentWillUpdate(nextProps: Props, nextState: TM_STATE_TYPE) {

   }

   componentDidUpdate(prevProps: Props, prevState: TM_STATE_TYPE) {

   }

   componentWillUnmount() {

   }

   render() {
      const { value, rowId, fieldsVisible, section, widthCell ,current ,onClick ,recordTouched ,sizesSum} = this.props;
      let fieldData ={}
      Object.values(value).forEach(sectionData=>{
         sectionData.forEach(sectionRecord=>{
            Object.keys(sectionRecord).forEach(fieldName=>{
               fieldData[fieldName]= fieldData[fieldName]?[...fieldData[fieldName],sectionRecord[fieldName].text] :[sectionRecord[fieldName].text]
            })
         })
      })
      let background = 'transparent';
      if (current) {
         background = 'rgba(0, 0, 0, 0.22)';
         // if (recordTouched) {
         //    background = 'rgba(63, 81, 181, 0.8)';
         // } else {
         // }
      } else if (recordTouched) {
         background = 'rgba(0, 188, 212, 0.2)';
      }
      return (
         <TableRow onClick={onClick} key={rowId} style={{ height: '32px' ,background:background }}>
            <TableCell component="th" scope="row" style={{ width: 50, padding: 0,  marginBottom: '22px' }} key={-1}>
               {rowId + 1}
            </TableCell>
            {fieldsVisible.map((_field, index) => {
               return (<TableCell component="th" scope="row" style={{ width: sizesSum[index], padding: 0, fontSize:'1em' }} key={index}>
                  {fieldData[_field.name]?fieldData[_field.name].join('`'):""}
               </TableCell>)
            })}
         </TableRow>
      );
   }
}

export default TableRecordRow;