// @flow strict

import * as React from 'react';

type Props = {||};

class TableRecordHeader extends React.Component<Props> {
   constructor(props: Props) {
      super(props);

   }

   componentWillMount() {

   }

   componentDidMount() {

   }

   componentWillReceiveProps(nextProps: Props) {

   }

   shouldComponentUpdate(nextProps: Props, nextState: TM_STATE_TYPE) {

   }

   componentWillUpdate(nextProps: Props, nextState: TM_STATE_TYPE) {

   }

   componentDidUpdate(prevProps: Props, prevState: TM_STATE_TYPE) {

   }

   componentWillUnmount() {

   }

   render() {
      const {total,sections, fields} = this.props;
      return (
      <TableRow>
         <TableCell style={{ width: 50, padding: 0, borderBottom: '0px' }} key={-1}>
            Total:{values.length}
         </TableCell>
         {fieldsVisible.map((_field, index) => {
            return <TableCell style={{ width: widthCell, padding: 0 }} key={index}>{_field.field_display}</TableCell>
         })}
         <TableCell style={{ width: 150, padding: 0 }} key={-2}>
         </TableCell>
      </TableRow>);
   }
}

export default TableRecordHeader;