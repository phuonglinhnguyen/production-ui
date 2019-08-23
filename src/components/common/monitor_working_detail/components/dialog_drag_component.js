import React, { Component } from 'react'

import { I18n } from "react-redux-i18n";
import TableX from "../../table-x/components/table";
import LinearProgress from "material-ui/LinearProgress";
import IconButton from "material-ui/IconButton";
import ActionAutoRenew from 'material-ui/svg-icons/action/autorenew'
import { numberForReport } from "../../../../utils/format_number";
import Dialog from 'material-ui/Dialog';
import Moment from "moment";

// const styles = {
//     main: {
//       position: "fixed",
//       height: 38,
//       zIndex: 10,
//       bottom: -15,
//       width: 122,
//       left: "calc(50% - 66px)"
//     },
//     table: {
//       height: 400,
//       width: "100%",
//       position: "fixed",
//       bottom: 0
//     }
//   };

const columns=[
  {
    name: "task_id",
    title: I18n.t("common.working_detail.task_id"),
    style: { width: "20%" },
    sort: true,
    render: data => {
      return <span title={data.task_id}>{data.task_id}</span>;
    }
  },
  {
    name: "id",
    title: I18n.t("common.working_detail.document_id"),
    style: { width: "20%" },
    sort: true,
    render: data => {
      return <span title={data.id}>{data.id}</span>;
    }
  },
  {
    name: "section",
    title: I18n.t("common.working_detail.section"),
    sort: true,
    style: { width: "20%" },
    render: data => {
      return  <span title={data.section}>{data.section}</span>;
    }
  },
  {
    name: "claim_time",
    title: I18n.t("common.working_detail.claim_time"),
    sort: true,
    style: { width: "15%" },
    render: data => {
      return data.claim_time&&data.claim_time.length>0?Moment(data.claim_time).format("YYYY/MM/DD HH:mm"):'';
    }
  },
  {
    name: "complete_time",
    title: I18n.t("common.working_detail.complete_time"),
    sort: true,
    style: { width: "15%" },
    render: data => {
      return data.complete_time&&data.complete_time.length>0? Moment(data.complete_time).format("YYYY/MM/DD HH:mm"):'';
    }
  },
  {
    name: "total_characters",
    title: I18n.t("common.working_detail.total_characters"),
    sort: true,
    style: { width: "10%" },
    render: data => {
      return numberForReport(data.total_characters);
    }
  }
]  
// ,
// {
//   name: "total_time",
//   title: I18n.t("common.working_detail.total_time"),
//   sort: true,
//   align_right: true,
//   style: { width: "10%" },
//   render: data => {
//     let ms = Moment(data.complete_time).diff(Moment(data.claim_time))/1000;
//     return `${Math.floor(ms/60)} min, ${Math.floor(ms%60)}s`
//   }
// },
export class DialogDrag extends Component {
  render() {
    const {actions,muiTheme,working_detail,projectId,username} = this.props;
      return (
        <Dialog
        title={`Working Detail: ${username}`}
        modal={false}
        open={working_detail.show}
        contentStyle={{
          width: '90%',
          maxWidth: 'none',
        }}
        onRequestClose={()=>actions.closeDialog()}
      >
            {working_detail.isFetching?  <LinearProgress mode="indeterminate" />:''}
            <IconButton
            tooltip="Refresh"
            style={{
              position: "absolute",
              right: 10,
              top: 15
            }}
            onClick={() => {
              actions.openDialog(projectId)
            }}
          >
            <ActionAutoRenew color={muiTheme.palette.accent1Color} />
          </IconButton>
            <TableX
            action_cellClick={(...p) => {}}
            muiTheme={muiTheme}
            columns={columns}
            datas={working_detail.items || []}
            paging={true}
            showRowHover={true}
            ref="table"
            search_keys={["section", "task_id","id"]}
            multiSelectable={false}
            pagingPosition={"bottom"}
            searchHintText={"Search"}
            selectable={false}
            tableStyle={{ bodyStyle: { height: 410 } }}
          />
      </Dialog>
    )
  }
}

export default DialogDrag
