import React from 'react';
import axios from 'axios';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import { topMenuBar, noRecordFound, Spinner } from '../../../utils/functionComponent'
import AddScreen from './add';
import EditScreen from './edit';
import ShareModel from "./ShareScreenModal";
import LocalStorageUtils from "../../../utils/LocalStorageUtils";
import constatns from "../../../constatns";

class Screens extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userAuth: false,
            screensListData: [],
            screensListStatus: false,
            isShowingModal: false,
            isLoading: true,
            projectId: "",
            isOpen: false
        }
    }

    componentDidMount() {
        let getLoggedInUser = LocalStorageUtils.get('LoggedInUser');
        if (getLoggedInUser) {
            this.setState({
                loggedInUser: JSON.parse(getLoggedInUser)
            });
        }
        this.fetchRecord();
    }

    fetchRecord() {
        this.setState({ isLoading: true })
        let { params: { projectId } } = this.props;
        var url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}screen/list/${projectId}`;
        axios.get(url)
            .then(response => {
                let { data: { result: { list: [screens] } } } = response;
                this.setState({
                    screensListData: screens,
                    screensListStatus: true,
                    isLoading: false
                });
            }).catch(error => {
                if (error && error.response && error.response.data && error.response.data.status) {
                    this.setState({ screensListStatus: false, isLoading: false });
                    toast.error(error.response.data.status === 'NOK' ? error.response.data.result.message : '');
                } else {
                    this.setState({ screensListStatus: false, isLoading: false });
                    toast.error('Invalid Request');
                }
            });
    }

    addScreenModal = (projectId) => {
        confirmAlert({
            title: 'Add Screen',
            message: <AddScreen projectId={projectId} />,
            confirmLabel: '',
            cancelLabel: 'Cancel',
            onConfirm: () => '',
            onCancel: () => ''
        })
    };

    editScreenModal = (screenId) => {
        confirmAlert({
            title: 'Update Screen',
            message: <EditScreen screenId={screenId} />,
            confirmLabel: '',
            cancelLabel: 'Cancel',
            onConfirm: () => '',
            onCancel: () => ''
        })
    };

    deleteScreenModal = (screenId) => {
        confirmAlert({
            title: 'Confirm',
            message: 'Are you sure to delete?',
            confirmLabel: 'Confirm',
            cancelLabel: 'Cancel',
            onConfirm: () => this.deleteScreen(screenId),
            onCancel: () => ''
        })
    };

    statusChangeScreenModal = (screenId) => {
        confirmAlert({
            title: 'Confirm',
            message: 'Are you sure want to change the status?',
            confirmLabel: 'Yes',
            cancelLabel: 'No',
            onConfirm: () => this.statusChangeScreen(screenId),
            onCancel: () => ''
        })
    };

    duplicateScreenModal = (projectId, screenId) => {
        confirmAlert({
            title: 'Confirm',
            message: 'Are you sure want to duplicate this screen?',
            confirmLabel: 'Yes',
            cancelLabel: 'No',
            onConfirm: () => this.duplicateScreen(projectId, screenId),
            onCancel: () => ''
        })
    };

    duplicateScreen(projectId, screenId) {
        let url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}screen_duplicate/${projectId}/${screenId}`;
        let { loggedInUser: [userData, token] } = this.state;
        let { id } = userData;
        let header = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }
        let form = new FormData();
        form.append('screen_id', screenId);
        form.append('project_id', projectId);
        form.append('user_id', id);
        axios.post(url, form, header)
            .then(response => {
                let message = response.data.result.message ? response.data.result.message : 'Create a duplicate screen successfully.';
                toast.success(message);
                this.fetchRecord();
            })
            .catch(error => {
                if (error && error.response && error.response.data && error.response.data.status) {
                    let message = error.response.data.result.message ? error.response.data.result.message : 'Something went wrong.';
                    toast.error(message);
                } else {
                    toast.error('Invalid Request');
                }
            });
    }

    statusChangeScreen(screenId) {
        let url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}screen/change_status`;
        let { loggedInUser: [token] } = this.state;
        let header = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }
        let form = new FormData();
        form.append('id', screenId);
        form.append('status', constatns.INACTIVE);
        axios.post(url, form, header)
            .then(response => {
                let message = response.data.result.message ? response.data.result.message : 'Status has been changed.';
                toast.success(message);
                this.fetchRecord();
            })
            .catch(error => {
                if (error && error.response && error.response.data && error.response.data.status) {
                    let message = error.response.data.result.message ? error.response.data.result.message : 'Something went wrong.';
                    toast.error(message);
                } else {
                    toast.error('Invalid Request');
                }
            });
    }

    deleteScreen(screenId) {
        let url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}screen/delete`;
        let { loggedInUser: [token] } = this.state;
        let header = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }
        let form = new FormData();
        form.append('id', screenId);
        axios.post(url, form, header)
            .then(response => {
                let message = response.data.result.message ? response.data.result.message : 'Record has been deleted.';
                toast.success(message);
                this.fetchRecord();
            })
            .catch(error => {
                if (error && error.response && error.response.data && error.response.data.status) {
                    let message = error.response.data.result.message ? error.response.data.result.message : 'Something went wrong.';
                    toast.error(message);
                } else {
                    toast.error('Invalid Request');
                }
            });
    }

    shareScreen(projectId) {
        this.setState({
            projectId: projectId, isOpen: true
        })
    }

    closeModal() {
        this.setState({
            isOpen: false
        })
    }

    screens() {
        let { screensListData, screensListStatus } = this.state;
        return screensListStatus && screensListData.screen && screensListData.screen.length > 0 ?
            screensListData.screen.map((screen, key) => {
                return (
                    <div className="blog" key={key}>
                        <Link to={`/project/${screen.project_id}/screen/${screen.id}/preview`} className="preview home">
                            <img src={screen.image} alt="screen" />
                        </Link>
                        <p>{screen.name ? screen.name.substring(0, 18) + (screen.name.length > 18 ? '...' : '') : ''}</p>
                        <div className="hoverable">
                            <button onClick={() => this.editScreenModal(screen.id)}><i className="fa fa-pencil fa-2x" aria-hidden="true"></i></button>
                            <button onClick={() => this.shareScreen(screen.project_id)}><i className="fa fa fa-share fa-2x" aria-hidden="true"></i></button>
                            <button onClick={() => this.duplicateScreenModal(screen.project_id, screen.id)}><i className="fa fa-clone fa-2x" aria-hidden="true"></i></button>
                            <button onClick={() => this.statusChangeScreenModal(screen.id)}><i className="fa fa-file-archive-o fa-2x" aria-hidden="true"></i></button>
                            <button onClick={() => this.deleteScreenModal(screen.id)}><i className="fa fa-trash fa-2x" aria-hidden="true"></i></button>
                        </div>
                    </div>
                )
            }) : noRecordFound();
    }

    handleOnKeyPress(e) {
        if (e.target.value) {
            const query = e.target.value.trim();
            if (query !== '') {
                this.searchScreen(query);
            } else {
                this.fetchRecord();
            }
        } else {
            this.fetchRecord();
        }
    }

    searchScreen(query) {
        let { params: { projectId } } = this.props;
        var url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}screens/search_query?screenQuery=${query}&project_id=${projectId}`;
        axios.get(url)
            .then(response => {
                let { data: { screen } } = response;
                this.setState({
                    screensListData: { screen: screen },
                    screensListStatus: true,
                });
            }).catch(error => {
                this.setState({ screensListStatus: false });
            });
    }

    render() {
        let screensList = this.screens();
        let { params: { projectId } } = this.props;
        return (
            <div>
                <div className="screens-main">
                    <div className="screen-head">
                        <div className="screens-main-div">
                            {topMenuBar('screens', projectId)}
                        </div>
                    </div >
                    <div className="add-screen-main">
                        <div className="search" >
                            <input id="search"
                                type="search"
                                placeholder="Search screens..."
                                onChange={this.handleOnKeyPress.bind(this)}
                            />
                        </div>
                        <div className="add-screen">
                            <button onClick={() => this.addScreenModal(projectId)}>
                                <span>
                                    <i className="fa fa-plus" aria-hidden="true"></i>
                                </span>
                                <span> New screen</span>
                            </button>
                        </div>
                    </div>
                    <div className="row">
                        {this.state.isLoading ? <Spinner /> : screensList}
                    </div>
                </div>
                <ShareModel isOpen={this.state.isOpen} closeModal={this.closeModal.bind(this)} projectId={this.state.projectId} />
            </div>
        );
    }
}

export default Screens;