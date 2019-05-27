import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
//import {Link} from 'react-router-dom';

class EditMember extends Component {
  constructor() {
    super();
    this.state = {
      formData: [],
      userAuth: false,
      error: [],
      memberResponse: []
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
    let getcurrentID = this.props.params.id;
    let url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}members/` + getcurrentID;
    var form = new FormData();

    axios.get(url, form)
      .then(response => {
        console.log(response);
        if (response.status === 200 && response.statusText === 'OK') {
          this.setState({ memberResponse: response.data.member });
          this.refs.first_name.value = response.data.member.firstname;
          this.refs.last_name.value = response.data.member.lastname;
          this.refs.email.value = response.data.member.email;

        }
      }).catch(error => {

      });
  };
  sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  formSubmit(e) {
    e.preventDefault();
    if (this.handleValidation()) {
      let getcurrentID = this.props.params.id;
      let first_name = this.refs.first_name.value;
      let last_name = this.refs.last_name.value;
      let email = this.refs.email.value;

      //var data = this.state.formData;
      let url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}members/update`;
      var form = new FormData();

      form.append('id', getcurrentID);
      form.append('firstname', first_name);
      form.append('lastname', last_name);
      form.append('email', email);

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
  
  handleValidation() {
    var formValid = true;
    let first_name = this.refs.first_name.value;
    let last_name = this.refs.last_name.value;
    let email = this.refs.email.value;
    var error = this.state.error;
    if (first_name === null || first_name === '') {
      formValid = false;
      error['first_name'] = true;
    }
    if (last_name === null || last_name === '') {
      formValid = false;
      error['last_name'] = true;
    }
    if (email === null || email === '') {
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
          <h2>Edit Member</h2>
        </div>
        <div className="add_people">
          <input type="text" ref="first_name" name="firstname" placeholder="Enter first name" /><br />
          {(this.state.error['first_name'] === true) ? <span className="err-text-change">This field is required.</span> : ''}<br />

          <input type="text" name="lastname" ref="last_name" placeholder="Enter last name" />
          {(this.state.error['last_name'] === true) ? <span className="err-text-change">This field is required.</span> : ''}<br />

          <input type="email" ref="email" name="email" placeholder="Enter email-Id" />
          {(this.state.error['email'] === true) ? <span className="err-text-change">This field is required.</span> : ''}<br />
          <button onClick={this.formSubmit.bind(this)}>Update</button>
        </div>
      </div>
    );
  }
}
export default EditMember;
