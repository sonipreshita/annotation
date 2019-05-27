import React, { Component } from 'react';
import axios from 'axios';
//import { Link } from 'react-router';
import { toast } from 'react-toastify';
import Select from 'react-select-plus';
import 'react-select-plus/dist/react-select-plus.css';

class Editteam extends Component {
  
    constructor() {
      super();
      this.state = {
        formData: [],
        userAuth: false,
        error: [],
        memberList: [],
        memberResponse: [],
        teamResponse: []
      }
    }

    componentWillMount() {
      let getLoggedInUser = localStorage.getItem('LoggedInUser');
      if (getLoggedInUser != null) {
        this.setState({
          userAuth: true,
          loggedInUser: JSON.parse(getLoggedInUser),
          currentMemmberArr: []
        });
      } else {
        window.location.href = '/';
      }
      let getcurrentID =this.props.params.id;
      let url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}team/` + getcurrentID;
      var form = new FormData();

      axios.get(url, form)
        .then(response => {
          console.log(response);
          if (response.status === 200 && response.statusText === 'OK') {
            this.setState({ teamResponse: response.data.result[0] });
            this.refs.name.value = response.data.result[0].name;
            // let options = [];
            //    response.data.teammembers.map(data => {   
            // return	options.push({ value: data.id, label: data.firstname + " " + data.lastname + "(" + data.email + ")" });
            // });
            console.log('team member' + response.data.memberData);
            this.setState({ memberResponse: response.data.memberData});
          
          }
        }).catch(error => {


        });
    };

    componentDidMount() {
      let getLoggedInUser = localStorage.getItem('LoggedInUser');
      if (getLoggedInUser != null) {
        this.setState({
          userAuth: true,
          loggedInUser: JSON.parse(getLoggedInUser)
        });

        var data = JSON.parse(getLoggedInUser);
        var userId = data[0]['id'];
        var url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}members/list/${userId}`;
        axios.get(url)
          .then(response => {
            let members = response.data.result.memebrs;
            this.setState({
              memberList: members
            });
          }).catch(error => {
          });
      } else {
        window.location.href = '/';
      }
  }

    sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }

    formSubmit(e) {
      e.preventDefault();
      if (this.handleValidation()) {
      
        let getcurrentID = this.props.params.id;
        let name = this.refs.name.value;
        var userData = this.state.loggedInUser;


        //var data = this.state.formData;
        let url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}team/update`;
        var form = new FormData();

        form.append('user_id', userData[0]['id']);
        form.append('team_id', getcurrentID);
        let members = this.refs.member.value;
        let memberArr = members.split(',');
        memberArr.map(function (item, i) {
        return form.append('member_ids', item);
        });
        form.append('name', name);
      

        axios.post(url, form)
          .then(response => {
            if (response.status === 200 && response.statusText === 'OK') {
              toast.success(response.data.result.message);
              this.sleep(1000).then(() => {
                window.location.href = '/team';
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

    logChange(val) {
      console.log("Selected: " + JSON.stringify(val));
    
      this.setState({
        memberListGroup: val
      }, () => {
        console.log('memberListGroup', this.state.memberListGroup)
      });
    }

    handleValidation() {
      var formValid = true;
      let name = this.refs.name.value;
      let members = this.refs.member.value;
      var error = this.state.error;
    
      if (name === null || name === '') {
        formValid = false;
        error['name'] = true;
      }
      if (members === null || members === '') {
        formValid = false;
        error['member'] = true;
      }

      this.setState({ error: error });
      return formValid;
    }
  
    render() {
      let options = [];
      this.state.memberList.map(data => {   
      return	options.push({ value: data.id, label: data.firstname + " " + data.lastname + "(" + data.email + ")" });
      });

      let membersFetch = [];
      this.state.memberResponse.map(data => {   
      return	membersFetch.push({ value: data.id, label: data.firstname + " " + data.lastname});
      });
      return (
        <div className="create_team_list">
          <div className="head">
            <h2>Edit Team</h2>
          </div>
          <div className="add_team_people">

            <input type="text" ref="name" name="name" className={(this.state.error['name'] === true) ? "error" : ''} placeholder="Enter team name" /><br />
            {(this.state.error['name'] === true) ? <span className="err-text-change">This field is required.</span> : ''}<br />

            <input type="hidden" ref="member" name="form-field-name" value={this.state.memberResponse}  className={(this.state.error['member'] === true) ? "error" : ''}  /><br />
            <Select
              name="form-field-name"
              value={membersFetch}
              options={options}
              multi={true}
              ref="members"
              joinValues={true}
              simpleValue={true}
              onChange={this.logChange.bind(this)}
            /><br />
            {(this.state.error['member'] === true) ? <span className="err-text-change">This field is required.</span> : ''}<br />

            <button onClick={this.formSubmit.bind(this)}>Update</button>
          </div>
        </div>
      );
    }
}
export default Editteam;