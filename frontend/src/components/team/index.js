import React, { Component } from 'react';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import JsonTable from 'react-json-table';
import { toast } from 'react-toastify';
import { Link } from 'react-router';

class TeamList extends Component {

    constructor() {
      super();
      this.state = {
        userAuth: false,
        teamList: [],
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
      let getuserArr = JSON.parse(getLoggedInUser);
      let userId = getuserArr[0].id;
      var url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}team/list/${userId}`;

      axios.get(url)
        .then(response => {
          let members = response.data.result.Team;
          this.setState({
            teamList: members
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
      var url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}team/delete`;
      var data = this.state.loggedInUser;
      var token = data[1];
      var header = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      }
      var form = new FormData();
      form.append('team_id', id);
      axios.post(url, form, header)
        .then(response => {
          toast.success(response.data.result.message);
          this.sleep(1000).then(() => {
           window.location.href = '/team';
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
      var teamlist = [];
      this.state.teamList.map((member, i) =>
      teamlist.push({
        Name: member.name , TotalMembers: member.members,Action: <div> <Link to={`/team/edit/${member.id}`}>Edit</Link>|  <Link  onClick={this.deleteConfirm.bind(this, member.id)} to=''>Delete</Link>  </div>
      }, )
      );
          
      let settings = {
        noRowsMessage: 'No record found.',
      };
      return (
        <div className="people_list">
          <div className="head">
            <h2>Team Lists</h2>
            <div className="add_project">
              <p><span><i className="fa fa-plus" aria-hidden="true"></i> </span><Link to="/team/createteam">New Team</Link> </p>
            </div>
          </div>
          <JsonTable rows={teamlist} settings={ settings } />
        </div>
      );
    }
}
export default TeamList;