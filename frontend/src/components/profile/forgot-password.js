import React, { Component } from 'react';
import axios from 'axios';
//import $ from 'jquery';
import { toast } from 'react-toastify';

class ForgotPassword extends Component {

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
        let url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}user/forgotpassword`;

        var form = new FormData();

        form.append('email', data['email']);

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
              toast.error(error.response.data.status === 'NOK' ? error.response.data.result.message.email || error.response.data.result.message : '');
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

      if (!field['email']) {
        formValid = false;
        error['email'] = true;
      }

      this.setState({ error: error });
      return formValid;
    }

    render() {
      return (
        <div className="forgot_pass">
          <div className="wrapper">
            <p>Forgot Password ?</p>
            <form id="forgot-pwd-form" name="forgot-pwd-form" method="POST">
              <input type="email" onChange={this.onchangehandler.bind(this, 'email')} ref="email" name="email" placeholder="Enter email-Id" /><br />
              {(this.state.error['email'] === true) ? <span className="err-text1">This field is required.</span> : ''}<br />

              <button className="send" onClick={this.formSubmit.bind(this)}>Send</button>
            </form>
            <div className="close_icon">
              <span><i className="fa fa-times" aria-hidden="true"></i></span>
            </div>
          </div>
        </div>
      );
    }
}
export default ForgotPassword;