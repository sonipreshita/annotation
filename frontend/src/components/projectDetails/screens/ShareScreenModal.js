import React from 'react';
import Modal from 'react-awesome-modal';
import Select from 'react-select-plus';
import 'react-select-plus/dist/react-select-plus.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import LocalStorageUtils from "../../../utils/LocalStorageUtils";

class ShareScreenModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            memberList: [],
            teamList: [],
            selectedValue: null,
            selectedTeam: null,
            members: true,
            teams: false
        }
    }

    componentWillMount() {
        let getLoggedInUser = LocalStorageUtils.get('LoggedInUser');
        if (getLoggedInUser) {
            this.setState({
                loggedInUser: JSON.parse(getLoggedInUser)
            });
        }
    }

    componentDidMount() {
        let { loggedInUser: [userData] } = this.state;
        let { id } = userData;
        let url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}members/list/${id}`;
        axios.get(url)
            .then(response => {
                let { data: { result: { membersdata: [membersObj] } } } = response;
                let { member } = membersObj;
                this.setState({
                    memberList: member
                });
            }).catch(error => { console.log('error : ', error) });
        this.getTeamList();
    }

    getTeamList() {
        let { loggedInUser: [userData] } = this.state;
        let { id } = userData;
        let url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}team/list/${id}`;
        axios.get(url)
            .then(response => {
                let { data: { result: { Team } } } = response;
                this.setState({
                    teamList: Team
                });
            }).catch(error => { console.log('error : ', error) });
    }

    logChange(val) {
        console.log('val', val)
        this.setState({
            selectedValue: val
        });
    }

    logChangeForTeam(val) {
        console.log('t', val)
        this.setState({
            selectedTeam: val
        });
    }

    sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    inviteMember() {
        let email = (this.state.selectedValue && this.state.selectedValue.value ? this.state.selectedValue.value : null);
        if (email) {
            let { projectId } = this.props;
            let { loggedInUser: [userData] } = this.state;
            let { id } = userData;
            let url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}project/invite`;
            axios.post(url, { userId: id, projId: projectId, email: email })
                .then(response => {
                    let message = response.data.result.message ? response.data.result.message : 'People has been invited.';
                    toast.success(message);
                    this.sleep(1000).then(() => {
                        //window.location.href = `/project/${projectId}/screen/${screenId}/${screen}`;
                        window.location.href = window.location.href
                    })
                })
                .catch(error => { console.log(error); });
        }
    }

    inviteTeam() {
        let teamId = (this.state.selectedTeam && this.state.selectedTeam.value ? this.state.selectedTeam.value : null);
        if (teamId) {
            let { projectId } = this.props;
            let { loggedInUser: [userData] } = this.state;
            let { id } = userData;
            let url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}project/team_invite`;
            axios.post(url, { userId: id, projId: projectId, teamId: teamId })
                .then(response => {
                    let message = response.data.result.message ? response.data.result.message : 'Team has been invited.';
                    toast.success(message);
                    this.sleep(1000).then(() => {
                        //window.location.href = `/project/${projectId}/screen/${screenId}/${screen}`;
                        window.location.href = window.location.href
                    })
                })
                .catch(error => { console.log(error); });
        }
    }

    membersOptions() {
        let { memberList } = this.state;
        let options = [];
        memberList.map(data => {
            options.push({ value: data.email, label: data.firstname + " " + data.lastname + "(" + data.email + ")" });
        });
        return options;
    }

    teamOptions() {
        let { teamList } = this.state;
        let teamOpt = [];
        teamList.map(data => {
            teamOpt.push({ value: data.id, label: data.name });
        });
        return teamOpt;
    }

    showTeam() {
        this.setState({
            members: false,
            teams: true
        })
    }

    showMember() {
        this.setState({
            members: true,
            teams: false
        })
    }

    render() {
        let membersOptions = this.membersOptions();
        let teamsOptions = this.teamOptions();

        return (
            <Modal
                visible={this.props.isOpen}
                width="650"
                height="300"
                effect="fadeInUp"
                onClickAway={() => this.props.closeModal}>
                <div className="modal-box">
                    <p className="close" onClick={this.props.closeModal}>&#10006;</p>
                    <h1>Invite people to screen</h1>
                    <div className="labelBox">
                        <label>
                            <input type="radio" value="option1" checked={this.state.members} onChange={this.showMember.bind(this)} />
                            <span style={{ marginLeft: 5 }}>Member</span>
                        </label>
                        <label style={{ marginLeft: 20 }}>
                            <input type="radio" value="option1" checked={this.state.teams} onChange={this.showTeam.bind(this)} />
                            <span style={{ marginLeft: 5 }}>Team</span>
                        </label>
                    </div>
                    <div className="box-container" style={{ display: (this.state.members === true ? 'block' : 'none') }}>
                        <Select
                            name="form-field-name"
                            value={this.state.selectedValue}
                            options={membersOptions}
                            ref="members"
                            onChange={this.logChange.bind(this)}
                        />
                        <br />
                        <div className="btn-wrapper">
                            <input type="button" className="btn" onClick={this.inviteMember.bind(this)} value="Invite" />
                        </div>
                    </div>
                    <div className="box-container" style={{ display: (this.state.teams === true ? 'block' : 'none') }}>
                        <Select
                            name="form-field-name"
                            value={this.state.selectedTeam}
                            options={teamsOptions}
                            ref="teams"
                            onChange={this.logChangeForTeam.bind(this)}
                        />
                        <br />
                        <div className="btn-wrapper">
                            <input type="button" className="btn" onClick={this.inviteTeam.bind(this)} value="Invite" />
                        </div>
                    </div>

                </div>
            </Modal >
        );
    }
}
export default ShareScreenModal;