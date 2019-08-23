import React from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

class LoginHire extends React.PureComponent {
  state = {
    open: false
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div className="hire">
        <div className="body">
          <div className="note">
            Chạm nhẹ "MÌNH" để xem tin tuyển dụng HOT!!!
          </div>
          <div
            className="smile"
            onClick={this.handleOpen}
            title="Đăng ký tuyển dụng"
          />
        </div>
        <Dialog
          modal={false}
          actions={<FlatButton label="Đóng" onClick={this.handleClose} />}
          className="login-dialog"
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <h4>THÔNG BÁO TUYỂN DỤNG VỊ TRÍ</h4>
          <h2>NHẬP DỮ LIỆU FULLTIME</h2>
          <h4>LÀM VIỆC TẠI CÔNG TY QUẬN 12 TPHCM Các Hình thức đăng ký:</h4>
          <div className="logos">
            <a
              target="blank"
              onClick={() =>
                window.open(
                  "https://docs.google.com/forms/d/1rxHKUCcWYXTqGek7D0MgphVmls4AZedCobXxRI403S8/viewform?edit_requested=true",
                  "_blank"
                )
              }
            >
              <div className="logo">
                <div className="icon-google" />
                <div className="label">Mẫu đăng ký</div>
              </div>
            </a>
            <a
              target="blank"
              onClick={() =>
                window.open(
                  "https://www.facebook.com/digitexxvieclam/",
                  "_blank"
                )
              }
            >
              <div className="logo">
                <div className="icon-facebook" />
                <div className="label">Fan page</div>
              </div>
            </a>
          </div>
          <div style={{ marginTop: 30 }}>
            <div>
              <i
                style={{ width: 45 }}
                className="fa fa-envelope icon"
                aria-hidden="true"
              />
              <span className="content">hr@digi-texx.vn</span>
            </div>
            <div style={{ marginTop: 14 }}>
              <i
                style={{ width: 45 }}
                className="fa fa-phone icon"
                aria-hidden="true"
              />
              <span className="content">
                0902518218 <span className="hotline">(hotline)</span>
              </span>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default LoginHire;
