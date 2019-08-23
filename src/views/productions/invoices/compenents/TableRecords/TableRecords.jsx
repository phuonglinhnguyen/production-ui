import * as React from 'react';
import { isEqual } from 'lodash'
import { withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
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
import { getDataObject } from '@dgtx/coreui';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import TableRecordRow from './TableRecordRow'
import { AutoSizer } from '../../../../../@components/common';
import calculateText from './calculateText'
const arrSum = arr => arr.reduce((a,b) => a + b, 0)



type Props = {||};

const styles = (theme) => {
   return {
      root: {
         // ...theme.mixins.gutters(),
         // background:'red',
         width: 'calc(100% - 120px)',
         marginLeft: 8,
         marginTop: 4,
         overflow: 'hidden',
         width: 'calc(100% - 23px)',
         height: 'calc(100% - 18px)',
         padding: '0px 4px 8px 4px',
      },
      table: {
         fontSize: "1.1em",

      },
      tableScroll: {

      },
      scrollHead: {
         overflow: 'hidden',
         position: 'relative',
         border: '0px',
         width: '100%',
      },
      scrollBody: {
         overflow: 'auto',
         width: 'calc(100% + 5px)',
         height: 'calc(100% - 24px)'
      }
   }
}
// @AutoSizer
class TableRecords extends React.Component<Props> {
   constructor(props: Props) {
      super(props);
      let fieldsVisible = [];
      props.sections.forEach(section => {
         section.fields.forEach(field => {
            fieldsVisible.push(field)
         })
      })
      let sizesHeader = calculateText.calculatorWidthTableHeader(fieldsVisible);
      this.state = {
         fieldsVisible,
         sizesHeader,
         sizesSum: [...sizesHeader]
      }
   }

   componentWillMount() {
   }


   componentWillReceiveProps(nextProps: Props) {
      if (!isEqual(nextProps.sections, this.props.sections)) {
         let fieldsVisible = [];
         nextProps.sections.forEach(section => {
            section.fields.forEach(field => {
               fieldsVisible.push(field)
            })
         })
         let sizesHeader = calculateText.calculatorWidthTableHeader(fieldsVisible);
         if (nextProps.values && nextProps.values.length) {
           
            let sizesBody = calculateText.calculatorWidthTableBody(nextProps.values, this.state.fieldsVisible);
            let sizesSum = calculateText.mergeSize(sizesHeader, sizesBody, 240);
            this.setState({
               sizesHeader,
               sizesSum,
               fieldsVisible
            })
         } else {
            this.setState({
               fieldsVisible,
               sizesHeader,
               sizesSum:calculateText.mergeSize(sizesHeader, [], 240)
            })
         }
      } else if(!isEqual(nextProps.values, this.props.values)){
         if (nextProps.values && nextProps.values.length) {
            let sizesBody = calculateText.calculatorWidthTableBody(nextProps.values, this.state.fieldsVisible);
            let sizesSum = calculateText.mergeSize(this.state.sizesHeader, sizesBody, 240);
            this.setState({
               sizesSum
            })
         } else {
            this.setState({
               sizesSum:calculateText.mergeSize(this.state.sizesHeader, [], 240)
            })
         }
      }
   }

   shouldComponentUpdate(nextProps: Props, nextState: TM_STATE_TYPE) {
      return !isEqual(this.props.values, nextProps.values)
         || this.props.sections !== nextProps.sections
         || this.props.height !== nextProps.height
         || this.props.current !== nextProps.current
         || this.state !== nextState


   }

   componentWillUpdate(nextProps: Props, nextState: TM_STATE_TYPE) {

   }

   componentDidUpdate(prevProps: Props, prevState: TM_STATE_TYPE) {

   }

   componentWillUnmount() {

   }
   handleBodyScroll = (event) => {
      this._header.scrollLeft = this._body.scrollLeft

   }
   componentDidMount() {
      // console.log('===============calculateText=====================');
      // console.log(calculateText.getTextSize('nhhien'));
      // console.log('===================================='); 



      this._body.addEventListener('scroll', this.handleBodyScroll)
   }

   render() {
      const { showRecords,
         values = [],
         fields,
         sections = [],
         current,
         classes,
         height, width,
         handleChangeRecord,
         recordsTouched
      } = this.props;
      const { fieldsVisible, sizesSum } = this.state;
      let lengthHeader = fieldsVisible.length;
      const widthCell = 250;
      const renderHeader = (values, sections, fields) => {
         return (
            <TableRow style={{ height: 32 }}>
               <TableCell style={{ width: 50, padding: 0 /** borderBottom: '0px'  */ }} key={-1}>
                  Total:{values.length}
               </TableCell>
               {fields.map((_field, index) => {
                  return <TableCell style={{ width: sizesSum[index], padding: 0 }} key={index}>{_field.field_display}</TableCell>
               })}
               <TableCell style={{ width: 150, padding: 0 }} key={-2}>
               </TableCell>
            </TableRow>
         )
      }
      return (
         <Paper className={classes.root} elevation={5}>
            <div
               ref={node => this._header = node}
               className={classes.scrollHead}>
               <div style={{
                  maxWidth: '300px'
               }}>
                  <Table style={{ width: arrSum(sizesSum) + 200 }} className={classes.table}>
                     <TableHead>
                        {renderHeader(values, sections, fieldsVisible)}
                     </TableHead>
                  </Table>
               </div>
            </div>
            <div
               ref={node => this._body = node}
               className={classes.scrollBody}>
               <div style={{ margin: 0 }}>
                  <Table style={{ width: arrSum(sizesSum) + 50 }} className={classes.table}>
                     <TableBody>
                        {values.map((value, rowId) => {
                           return (
                              <TableRecordRow key={rowId} onClick={_ => { handleChangeRecord(rowId) }} sizesSum={sizesSum} recordTouched={recordsTouched[rowId]} widthCell={widthCell} value={value} current={current === rowId} rowId={rowId} fieldsVisible={fieldsVisible} sections={sections} />
                           );
                        })}
                        <TableRow key={'empty'}></TableRow>
                     </TableBody>
                  </Table>
               </div>
            </div>
         </Paper>
      );
   }
}

export default withStyles(styles, { withTheme: true })(TableRecords);