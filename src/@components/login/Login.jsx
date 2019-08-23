import React from "react";
import { Translate } from "react-redux-i18n";
import { TextField, Button } from '@material-ui/core'
import { APP_VERSION } from '../../constants'
const styles = {
  labelStyle: {
    color: "#FFFFFF"
  },
  floatingLabelFocusStyle: {
    color: "#FFFFFF"
  },
  inputStyle: {
    color: "#FFFFFF"
  },
  floatingLabelStyle: {
    fontSize: 20,
    color: "#FFFFFF"
  },
  errorStyle: {
    fontSize: 14,
    color: 'red'
  },
  underlineFocusStyle: {
    borderColor: "#FFFFFF"
  }
};

class Login extends React.Component {
  state = {
    completed: 0,
    status_text: '',
    username: '',
    password: '',
    invalid_user_name: '',
    invalid_password: ''
  }
  doLogin=()=> {
    this.props.doLogin(this.state,'','/home');
  }
  doRegister=()=> {
    this.props.history.push("/signup");
  }

  handleKeyPress = (event) => {
    if (event.charCode === 13) {
      this.doLogin();
    }
  }

  onChange = (name) => (e) => {
    this.setState({ [name]: e.target.value })
  }
  render() {
    const {
      username,
      password,
      invalid_user_name,
      invalid_password,
      status_text,
      // completed,
    } = this.state;
    return (
        <div className="login">
          <div className="login-main">
            <div className="card">
              <div className="title">Elrond</div>
              <div className="login-body">
                {status_text && <p className="div-error">{status_text}</p>}
                <div className="div-input">
                  <TextField
                    name="username"
                    fullWidth={true}
                    floatingLabelFixed={true}
                    value={username}
                    ref={input => {
                      this.usernameInput = input;
                    }}
                    autoComplete="off"
                    errorText={invalid_user_name}
                    floatingLabelText={<Translate value="login.username" />}
                    onChange={this.onChange('username')}
                    inputStyle={styles.inputStyle}
                    errorStyle={styles.errorStyle}
                    underlineFocusStyle={styles.underlineFocusStyle}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                    onKeyPress={this.handleKeyPress}
                  />
                </div>
                <div className="div-input">
                  <TextField
                    name="password"
                    value={password}
                    fullWidth={true}
                    floatingLabelFixed={true}
                    type="password"
                    errorText={invalid_password}
                    floatingLabelText={<Translate value="login.password" />}
                    onChange={this.onChange('password')}
                    onKeyPress={this.handleKeyPress}
                    inputStyle={styles.inputStyle}
                    errorStyle={styles.errorStyle}
                    underlineFocusStyle={styles.underlineFocusStyle}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                  />
                </div>
                <Button
                  style={{ marginTop: 15 }}
                  type="submit"
                  primary={true}
                  fullWidth={true}
                  label={<Translate value="login.submit" />}
                  onClick={this.doLogin}
                >
                Signin
                </Button>
                <Button
                  style={{
                    marginTop: 15
                  }}
                  labelStyle={{
                    textTransform: "inherit",
                    color: "white",
                    fontWeight: 300
                  }}
                  fullWidth={true}
                  label={<Translate dangerousHTML value="login.register" />}
                  onClick={this.doRegister}
                />
              </div>
            </div>
          </div>
          <div className="version">{`v${APP_VERSION}`}</div>
        </div>
    );
  }
}
export default Login;
