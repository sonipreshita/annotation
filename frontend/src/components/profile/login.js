import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import { toast } from 'react-toastify';

class Login extends Component {

  constructor() {
    super();
    this.state = {
      formData: [],
      error: [],
    }
  }

  sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  formSubmit(e) {

    e.preventDefault();
    if (this.handleValidation()) {
      var data = this.state.formData;
      let url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}user/login`;

      var form = new FormData();
      form.append('email', data['loginemail']);
      form.append('password', data['loginpassword']);

      axios.post(url, form)
        .then(response => {
          if (response.status === 200 && response.statusText === 'OK') {
            var userArr = [];
            userArr[0] = response.data.result.user;
            userArr[1] = response.data.result.token;
            localStorage.setItem('LoggedInUser', JSON.stringify(userArr));
            toast.success(response.data.result.message);
            this.sleep(1000).then(() => {
              window.location.href = '/';
            })
          }
        }).catch(function (error) {
          if (error && error.response && error.response.data && error.response.data.status) {
            toast.error(error.response.data.status === 'NOK' ? error.response.data.result.message.email || error.response.data.result.message.password || error.response.data.result.message : '');
          } else {
            toast.error('Invalid Request');
          }
        });
    }
  }

  onchangehandler(field, e) {
    let formData = this.state.formData;
    let error = this.state.error;
    formData[field] = e.target.value;
    error[field] = false;
    this.setState({ error: error });
  }

  handleValidation() {
    var formValid = true;
    var field = this.state.formData;
    var error = this.state.error;

    if (!field['loginemail']) {
      formValid = false;
      error['loginemail'] = true;
    }
    if (!field['loginpassword']) {
      formValid = false;
      error['loginpassword'] = true;
    }

    this.setState({ error: error });
    return formValid;
  }

  render() {
    return (
      <div className="login_form">
        <div className="wrapper">
          <p>Login here !</p>
          <form id="loginform" name="loginform" method="POST">

            <input type="email" onChange={this.onchangehandler.bind(this, 'loginemail')} ref="loginemail" name="email" placeholder="Email-Id" /><br />
            {(this.state.error['loginemail'] === true) ? <span className="err-text1">This field is required.</span> : ''}<br />

            <input type="password" onChange={this.onchangehandler.bind(this, 'loginpassword')} ref="loginpassword" name="password" placeholder="Password" /><br />
            {(this.state.error['loginpassword'] === true) ? <span className="err-text1">This field is required.</span> : ''}<br />

            <button className="login" onClick={this.formSubmit.bind(this)}>Login</button>
            <div className="f_link">
              <span>Forgot password ? </span> <Link to="/forgot-password" className="forgot_pass_link">click here</Link>
            </div>

          </form>
          <div className="close_icon">
            <span><i className="fa fa-times" aria-hidden="true"></i></span>
          </div>
        </div>
      </div>
    );
  }
}
export default Login;