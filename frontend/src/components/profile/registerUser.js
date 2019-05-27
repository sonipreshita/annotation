import React, { Component } from 'react';
import axios from 'axios';
//import $ from 'jquery';
import { toast } from 'react-toastify';

class registerUser extends Component {

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
      let { params: { projectId } } = this.props;
      var data = this.state.formData;
      let url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}user/signup`;
      var form = new FormData();

      form.append('first_name', data['first_name']);
      form.append('last_name', data['last_name']);
      form.append('email', data['email']);
      form.append('password', data['password']);
      form.append('confirm_password', data['confirm_password']);
      form.append('project_id', projectId);

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

    if (!field['first_name']) {
      formValid = false;
      error['first_name'] = true;
    }
    if (typeof field["first_name"] !== "undefined") {
      if (!field["first_name"].match(/^[a-zA-Z ]+$/)) {
        formValid = false;
        error['first_name'] = true;
      }
    }
    if (!field['last_name']) {
      formValid = false;
      error['last_name'] = true;
    }
    if (!field['email']) {
      formValid = false;
      error['email'] = true;
    }
    if (!field['password']) {
      formValid = false;
      error['password'] = true;
    }
    if (!field['confirm_password']) {
      formValid = false;
      error['confirm_password'] = true;
    }
    else if (field["confirm_password"] !== field["password"]) {
      formValid = false;
      error["password_check"] = true;
    }

    this.setState({ error: error });
    return formValid;
  }

  render() {
    return (
      <div className="register_form" style={{ display: 'block' }}>
        <div className="wrapper">
          <p>Get youself registered here !</p>
          <form id="" name="registerform" method="POST">

            <input type="text" ref="first_name" onChange={this.onchangehandler.bind(this, 'first_name')} className={(this.state.error['first_name'] === true) ? "error" : ''} name="first_name" placeholder="Enter your first name" /><br />
            {(this.state.error['first_name'] === true) ? <span className="err-text">This field is required.</span> : ''}<br />

            <input type="text" name="last_name" onChange={this.onchangehandler.bind(this, 'last_name')} ref="last_name" placeholder="Enter your last name" /><br />
            {(this.state.error['last_name'] === true) ? <span className="err-text">This field is required.</span> : ''}<br />

            <input type="email" name="email" onChange={this.onchangehandler.bind(this, 'email')} ref="email" placeholder="Enter your email id" /><br />
            {(this.state.error['email'] === true) ? <span className="err-text">This field is required.</span> : ''}<br />

            <input type="password" name="password" onChange={this.onchangehandler.bind(this, 'password')} ref="password" placeholder="Enter password" /><br />
            {(this.state.error['password'] === true) ? <span className="err-text">This field is required.</span> : ''}<br />
            {(this.state.error['passwordlength'] === true) ? <span className="err-text">Password must be minimum 4 digit.</span> : ''}<br />

            <input type="password" onChange={this.onchangehandler.bind(this, 'confirm_password')} ref="confirm_password" name="confirm_password" placeholder="Re-enter your password" /><br />
            {(this.state.error['confirm_password'] === true) ? <span className="err-text">This field is required.</span> : ''}<br />
            {(this.state.error['password_check'] === true) ? <span className="err-text">Password must be same.</span> : ''}<br />

            <button className="reg" onClick={this.formSubmit.bind(this)}>Register</button>
            <button className="reset" type="reset">Reset</button>
          </form>
        </div>
      </div>
    );
  }
}

export default registerUser;