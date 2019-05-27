import React from 'react';
import Modal from 'react-awesome-modal';
import Select from 'react-select-plus';
import 'react-select-plus/dist/react-select-plus.css';
import axios from 'axios';
import { toast } from 'react-toastify';

class ShareProject extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            memberList: [],
        }
    }

    componentWillMount() {
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
                    let members = response.data.result.membersdata[0].member;
                    this.setState({
                        memberList: members
                    });
                }).catch(error => {
                });
        }
    }

    logChange(val) {
        this.setState({
            selectedValue: val
        });
    }

    sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    inviteMember() {
        let data = this.state.loggedInUser;
        let email = (this.state.selectedValue.value ? this.state.selectedValue.value : '');
        let { projectId, screenId } = this.props;
        let userId = data[0]['id'];
        let url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}project/invite`;

        axios.post(url, { userId: userId, projId: projectId, email: email })
            .then(response => {
                toast.success(response.data.result.message);
                this.sleep(1000).then(() => {
                    window.location.href = `/project/${projectId}/screen/${screenId}`;
                })
            })
            .catch(error => {
                console.log(error);
            });
    }

    render() {
        let options = [];
        this.state.memberList.map(data => {
            return options.push({ value: data.email, label: data.firstname + " " + data.lastname + "(" + data.email + ")" });
        });

        return (
            <Modal
                visible={this.props.isOpen}
                width="650"
                height="300"
                effect="fadeInUp"
                onClickAway={() => this.props.closeModal}>
                <div className="modal-box">
                    <p className="close" onClick={this.props.closeModal}>&#10006;</p>
                    <h1>Invite people to project</h1>
                    <div className="box-container">
                        <Select
                            name="form-field-name"
                            value={this.state.selectedValue}
                            options={options}
                            ref="members"
                            onChange={this.logChange.bind(this)}
                        />
                        <br />
                        <div className="btn-wrapper">
                            <input type="button" className="btn" onClick={this.inviteMember.bind(this)} value="Invite" />
                        </div>
                    </div>
                </div>
            </Modal >
        );
    }
}
export default ShareProject;