import React, { Component } from 'react';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import JsonTable from 'react-json-table';
import { toast } from 'react-toastify';
import { Link } from 'react-router';

class MemberList extends Component {

    constructor() {
      super();
      this.state = {
        userAuth: false,
        memberList: [],
        limit: 3
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

    }

    componentDidMount() {
      var data = this.state.loggedInUser;
      var userId = data[0]['id'];
      var url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}members/list/${userId}`;
      axios.get(url)
        .then(response => {
          let members = response.data.result.membersdata[0].member;
          this.setState({
            memberList: members
          });

        }).catch(function (error) {
          if (error && error.response && error.response.data && error.response.data.status) {
            toast.error(error.response.data.status === 'NOK' ? error.response.data.result.message : '');
          } else {
            toast.error('Invalid Request');
          }
        });
    }

    deleteConfirm = (id) => {
      confirmAlert({
        title: 'Confirm',
        message: 'Are you sure to delete?',
        confirmLabel: 'Confirm',
        cancelLabel: 'Cancel',
        onConfirm: () => this.handleDeletemember(id),
        onCancel: () => ''
      })
    };

    sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }

    handleDeletemember(id) {
      var url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}members/delete`;
      var data = this.state.loggedInUser;
      var token = data[1];
      var header = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      var form = new FormData();
      form.append('id', id);
      axios.post(url, form, header)
        .then(response => {
          toast.success(response.data.result.message);
          this.sleep(1000).then(() => {
            window.location.href = '/members';
          })
        })
        .catch(error => {
          if (error && error.response && error.response.data && error.response.data.status) {
            toast.error(error.response.data.status === 'NOK' ? error.response.data.result.message: '');
          } else {
            toast.error('Invalid Request');
          }
        });
    }

    render() {
      var memberlist = [];
      this.state.memberList.map((member, i) =>
        memberlist.push({
          Name: member.firstname + " " + member.lastname, Email: member.email, Action: <div> <Link to={`/members/edit/${member.id}`}>Edit</Link>  |  <Link  onClick={this.deleteConfirm.bind(this, member.id)} to=''>Delete</Link>  </div>
        }, )
      );
     
      let settings = {
        noRowsMessage: 'No record found.',
      };

      return (
        <div className="people_list">
          <div className="head">
            <h2>Member Lists</h2>
            <div className="add_project">
              <p><span><i className="fa fa-plus" aria-hidden="true"></i> </span><Link to="/members/add">Add Member</Link> </p>
            </div>
          </div>
          <JsonTable rows={memberlist} settings={ settings } />
        </div>
      );
    }
}
export default MemberList;