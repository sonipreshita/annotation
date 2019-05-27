import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

class EditProfile extends Component {

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
        var userData = this.state.loggedInUser;

        let url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}user/update`;
        var token = userData[1];

        var form = new FormData();
        let first_name=this.refs.first_name.value;
        let last_name=this.refs.last_name.value;
        let email=this.refs.email.value;
        form.append('user_id', userData[0]['id']);
        form.append('first_name',first_name );
        form.append('last_name',last_name);
        form.append('email',email);

        var header = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        };

        axios.post(url, form, header)
          .then(response => {
          
            if (response.status === 200 && response.statusText === 'OK') {
            let userDetail=response.data.result.user; 
            var userData = []
            let user = this.state.loggedInUser;
            userData.push(userDetail[0], user[1]);
            localStorage.setItem('LoggedInUser', JSON.stringify(userData));
            toast.success(response.data.result.message);
            this.sleep(1000).then(() => {
              window.location.href = '/';
          })
            }
          }).catch(error => {
            if (error && error.response && error.response.data && error.response.data.status) {
              toast.error(error.response.data.status === 'NOK' ? error.response.data.result.message : '');
            } else {
              toast.error('Invalid Request');
            }
          });
      }
    }

    handleValidation() {
      var formValid = true;
      let first_name=this.refs.first_name.value;
      let last_name=this.refs.last_name.value;
      var error = this.state.error;
      if (first_name===null || first_name==='') {
        formValid = false;
        error['first_name'] = true;
      }
      if (last_name===null || last_name==='') {
        formValid = false;
        error['last_name'] = true;
      }
      this.setState({ error: error });

      return formValid;
    }

    render() {
      let userData = this.state.loggedInUser;
      return (
        <div className="view_profile_list">
          <div className="head">
            <h2>Edit Profile</h2>
          </div>
          <div className="inside_blog">
            <form>
              <input type="text" name="first_name" defaultValue={userData[0]['first_name']} ref="first_name"  className={(this.state.error['first_name'] === true) ? "error" : ''} placeholder="Enter first name" /><br />
              {(this.state.error['first_name'] === true) ? <span className="err-textchange_profile">This field is required.</span> : ''}<br />

              <input type="text" defaultValue={userData[0]['last_name']}  ref="last_name" name="last_name" placeholder="Enter last name" /><br />
              {(this.state.error['last_name'] === true) ? <span className="err-textchange_profile">This field is required.</span> : ''}<br />

              <input type="email" defaultValue={userData[0]['email']}  ref="email" name="email" placeholder="Enter Email" readOnly /><br />
              {(this.state.error['email'] === true) ? <span className="err-textchange_profile">This field is required.</span> : ''}<br />
            </form>
          </div>
          <button className="update_setting" onClick={this.formSubmit.bind(this)}>Update Profile</button>
        </div>
      );
    }
}
export default EditProfile;