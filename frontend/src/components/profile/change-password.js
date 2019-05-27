import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

class ChangePassword extends Component {

    constructor() {
      super();
      this.state = {
        formData: [],
        error: [],
        userAuth: false,
        loggedInUser: []
      }
    }

    componentWillMount() {
      let getLoggedInUser = localStorage.getItem('LoggedInUser');
      if (getLoggedInUser != null) {
        this.setState({
          userAuth: true,
          loggedInUser: JSON.parse(getLoggedInUser)
        });
      } else {
        window.location.href = '/';
      }
    };

    sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }

    formSubmit(e) {
      e.preventDefault();

      if (this.handleValidation()) {
        var userData = this.state.loggedInUser;
        var data = this.state.formData;
        let url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}user/changepassword`;
        var token = userData[1];
        var form = new FormData();

        form.append('user_id', userData[0]['id']);
        form.append('oldpassword', data['password']);
        form.append('newpassword1', data['new_pass']);
        form.append('newpassword2', data['confirm_password']);

        var header = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        };

        axios.post(url, form, header)
          .then(response => {
            if (response.status === 200 && response.statusText === 'OK') {
              toast.success(response.data.result.message);
              this.sleep(1000).then(() => {
                window.location.href = '/';
            })
            }
          }).catch(error => {
            if (error && error.response && error.response.data && error.response.data.status) {
              toast.error(error.response.data.status === 'NOK' ? error.response.data.result.message.password1 || error.response.data.result.message : '');
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
      if (!field['new_pass']) {
        formValid = false;
        error['new_pass'] = true;
      }
      if (!field['confirm_password']) {
        formValid = false;
        error['confirm_password'] = true;
      }
      if (field["new_pass"] !== field["confirm_password"]) {
        formValid = false;
        error["password_check"] = true;
      }

      this.setState({ error: error });
      return formValid;
    }

    render() {
      return (
        <div className="change_password_list">
          <div className="head">
            <h2>Change Password</h2>
          </div>
          <div className="inside_wrapper">
            <form>
              <input type="password" name="old_pass" onChange={this.onchangehandler.bind(this, 'password')} ref="password" placeholder="Enter old password" /><br />
              {(this.state.error['password'] === true) ? <span className="err-text-change">This field is required.</span> : ''}

              <input type="password" name="new_pass" placeholder="Enter new password" onChange={this.onchangehandler.bind(this, 'new_pass')} ref="new_pass" /><br />
              {(this.state.error['new_pass'] === true) ? <span className="err-text-change">This field is required.</span> : ''}

              <input type="password" onChange={this.onchangehandler.bind(this, 'confirm_password')} ref="confirm_password" name="confirm_new_pass" placeholder="Enter confirm new password" /><br />
              {(this.state.error['confirm_password'] === true) ? <span className="err-text-change">This field is required.</span> : ''}<br />
              {(this.state.error['password_check'] === true) ? <span className="pwd">Password must be same.</span> : ''}

              <button onClick={this.formSubmit.bind(this)} className="change">Change</button>
            </form>
          </div>
        </div>
      );
    }
}
export default ChangePassword;