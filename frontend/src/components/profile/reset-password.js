import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

class ResetPassword extends Component {

    constructor() {
      super();
      this.state = {
        formData: [],
        error: [],
      }
    }

    componentWillMount() {
      let token = this.props.params.token;
      if (!token) {
        this.props.history.push('/');
        return;
      }
    };

    sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }

  formSubmit(e) {
    e.preventDefault();

      if (this.handleValidation()) {
        var data = this.state.formData;
        let url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}user/resetpassword`;

        var form = new FormData();
        form.append('resetPassToken', this.props.params.token);
        form.append('password', data['password']);
        form.append('password2', data['confirm_password']);

        axios.post(url, form)
          .then(response => {
            if (response.status === 200 && response.statusText === 'OK') {
              toast.success(response.data.result.message);
              this.sleep(1000).then(() => {
                window.location.href = '/';
            })
            }
          }).catch(function (error) {
            if (error && error.response && error.response.data && error.response.data.status) {
              toast.error(error.response.data.status === 'NOK' ? error.response.data.result.message || error.response.data.result.message.password1 : '');
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

      if (!field['password']) {
        formValid = false;
        error['password'] = true;
      }
      if (!field['confirm_password']) {
        formValid = false;
        error['confirm_password'] = true;

      } else if (field["confirm_password"] !== field["password"]) {
        formValid = false;
        error["password_check"] = true;
      }

      this.setState({ error: error });
      return formValid;
    }

    render() {
      return (
        <div className="reset_form">
          <div className="wrapper">
            <p>Reset Password !</p>
            <form id="reset-pwd-form" name="test" method="POST">
              <input type="password" name="password" onChange={this.onchangehandler.bind(this, 'password')} ref="password" placeholder="Enter password" /><br />
              {(this.state.error['password'] === true) ? <span className="err-text1">This field is required.</span> : ''}<br />
              <input type="password" onChange={this.onchangehandler.bind(this, 'confirm_password')} ref="confirm_password" name="confirm_password" placeholder="Re-enter your password" /><br />
              {(this.state.error['confirm_password'] === true) ? <span className="err-text1">This field is required.</span> : ''}<br />
              {(this.state.error['password_check'] === true) ? <span className="err-text1">Password must be same.</span> : ''}<br />
              <button className="reserPassword" onClick={this.formSubmit.bind(this)}>Change</button>
            </form>
          </div>
        </div>
      );
    }
}
export default ResetPassword;