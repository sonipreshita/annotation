import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

class AddMember extends Component {
  constructor() {
    super();
    this.state = {
      formData: [],
      userAuth: false,
      error: [],
    }
  }

  componentWillMount() {
    let getLoggedInUser = localStorage.getItem('LoggedInUser');
    if (getLoggedInUser != null) {
      this.setState({
        userAuth: true,
        loggedInUser: JSON.parse(getLoggedInUser)
      });
    }else{
      window.location.href = '/';
    }
  };
  sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
  formSubmit(e) {
    e.preventDefault();

    if (this.handleValidation()) {
      var data = this.state.formData;
      let url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}members/add`;
      var userData = this.state.loggedInUser;
      var form = new FormData();

      form.append('id', userData[0]['id']);
      form.append('firstname', data['first_name']);
      form.append('lastname', data['last_name']);
      form.append('email', data['email']);

      axios.post(url, form)
        .then(response => {
          if (response.status === 200 && response.statusText === 'OK') {
            toast.success(response.data.result.message);
            this.sleep(1000).then(() => {
              window.location.href = '/members';
           })
          }
        }).catch(error => {
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
    this.setState({ error: error });

    return formValid;
  }

  render() {
    return (
      <div className="people_list">
        <div className="head">
          <h2>Add Member</h2>
          <div className="add_project">
            </div>
        </div>
        <div className="add_people">
          <input type="text" ref="first_name" name="firstname" onChange={this.onchangehandler.bind(this, 'first_name')} className={(this.state.error['first_name'] === true) ? "error" : ''} placeholder="Enter first name" /><br />
          {(this.state.error['first_name'] === true) ? <span className="err-text-change">This field is required.</span> : ''}<br />

          <input type="text" name="lastname" onChange={this.onchangehandler.bind(this, 'last_name')} ref="last_name" placeholder="Enter last name" />
          {(this.state.error['last_name'] === true) ? <span className="err-text-change">This field is required.</span> : ''}<br />

          <input type="email" onChange={this.onchangehandler.bind(this, 'email')} ref="email" name="email" placeholder="Enter email-Id" />
          {(this.state.error['email'] === true) ? <span className="err-text-change">This field is required.</span> : ''}<br />
          <button onClick={this.formSubmit.bind(this)}>Add Member</button>
        </div>
      </div>
    );
  }
}
export default AddMember;