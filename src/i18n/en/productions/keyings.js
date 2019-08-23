export default {
    button: {
      label: {
        claiming: 'Claiming',
        claim_this_task: 'Claim this task',
        claim_next_task: 'Claim next task'
      }
    },
    dialog: {
      message: {
        befor_save: 'Are you sure save task?'
      }
    },
    message: {
      info: {
        no_task: 'Hết hàng!'
      },
      warning: {
        trust_save: 'Bạn còn %{undone}/%{total_record} chưa hoàng thành!. Bạn có chắc muốn tiếp tục lưu dư liệu?',
        next_record_has_error: 'Bạn không thể qua record khác khi còn lỗi!',
        try_save: 'Thử lưu lại dữ liệu lần nữa?'
      },
      error: {
        cant_claim_task: "Can't claim task!",
        cant_get_task: "Can't get task!",
        complete_task_failed: 'Complete task failed!',
        save_document_failed: 'Save document failed!'
      },
      success: {
        save_success: 'Saved successfully!'
      },
      conform_save: `<span style="font-weight: bold">Dữ liệu của bạn sẽ được lưu trữ và bạn không thể sửa đổi được nữa!<span/>
        <br/>
        <br/>
        <span style="font-weight: normal;"> Bạn có muốn lưu dữ liệu này?<span/>`,
        conform_save_warning_overflow:`<span style="font-weight: bold; color:crimson;" >Bạn không thể lưu khi hình bị che khuất!</span> 
        <br/>
        <span style="font-weight: normal;">Vui lòng kiểm tra lại thông tin trên hình!</span>`

    }
};


