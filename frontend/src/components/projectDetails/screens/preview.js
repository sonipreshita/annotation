import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Link } from 'react-router';
import { Spinner } from '../../../utils/functionComponent'
import ShareScreenModal from './ShareScreenModal';
import LocalStorageUtils from "../../../utils/LocalStorageUtils";
import constatns from "../../../constatns";

class preview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userAuth: false,
            isOpen: false,
            comments: '',
            style: {},
            popoverStyle: {},
            commentList: [],
            imageCoords: [],
            x_cords: '',
            y_cords: '',
            commentsUptoNow: [],
            userId: '',
            screenDetails: [],
            memberData: [],
            isLoading: true,
            statusBox: false,
            displayPopover: false,
            displayPopoverIcon: false,
        };

    }

    statusBox() {
        this.setState({ statusBox: !this.state.statusBox })
    }

    componentWillMount() {
        let getLoggedInUser = LocalStorageUtils.get('LoggedInUser');
        if (getLoggedInUser) {
            this.setState({
                loggedInUser: JSON.parse(getLoggedInUser)
            });
        } else {
            window.location.href = '/';
        }
    }

    componentDidMount() {
        this.fetchScreenDetails();
    }

    sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    fetchScreenDetails() {
        let { params: { projectId, screenId } } = this.props;
        let { loggedInUser: [userData] } = this.state;
        //let { id } = userData;
        //let listUrl = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}comment/list`;
        let screenUrl = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}screen/${screenId}`;

        axios.get(screenUrl)
            .then(response => {
                if (response && response.status === 200) {
                    let { data: { result: { screen } } } = response;
                    this.setState({ screenDetails: screen, isLoading: false });
                } else {
                    toast.error('Something went wrong.');
                    this.sleep(1000).then(() => {
                        window.location.href = `/project/${projectId}/screens`;
                    })
                }
            })
            .catch(error => {
                this.setState({ isLoading: false });
                toast.error('Bad request.');
                this.sleep(1000).then(() => {
                    window.location.href = `/project/${projectId}/screens`;
                })
            });
    }

    openModal = () => {
        this.setState({
            isOpen: true
        });
    };

    hideModal = () => {
        this.setState({
            isOpen: false
        });
    };

    statusChangeScreen(screenId, status) {
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
        form.append('workflow_status', status);
        axios.post(url, form, header)
            .then(response => {
                let message = response.data.result.message ? response.data.result.message : 'Status has been changed.';
                toast.success(message);
                this.setState({ statusBox: !this.state.statusBox });
                this.fetchScreenDetails();
            })
            .catch(error => {
                if (error && error.response && error.response.data && error.response.data.status) {
                    let message = error.response.data.result.message ? error.response.data.result.message : 'Something went wrong.';
                    this.setState({ statusBox: !this.state.statusBox });
                    toast.error(message);
                } else {
                    this.setState({ statusBox: !this.state.statusBox });
                    toast.error('Invalid Request');
                }
            });
    }

    pageloader(url) {
        window.location.href = url;
    }

    render() {
        let { params: { projectId, screenId } } = this.props;
        let { statusBox } = this.state;

        return (
            <div>
                {this.state.isLoading ?
                    <Spinner /> :
                    <div className="project_page">
                        <div className="status" style={{ display: statusBox ? 'block' : 'none' }}>
                            <p className="status_p" onClick={() => this.statusChangeScreen(screenId, constatns.NEW)}><span className="icon new"></span><span className="text">New</span></p>
                            <p className="status_p" onClick={() => this.statusChangeScreen(screenId, constatns.IN_PROGRESS)}><span className="icon in_progress"></span><span className="text">InProgress</span></p>
                            <p className="status_p" onClick={() => this.statusChangeScreen(screenId, constatns.ON_HOLD)}><span className="icon on_hold"></span><span className="text">OnHold</span></p>
                            <p className="status_p" onClick={() => this.statusChangeScreen(screenId, constatns.APPROVED)}><span className="icon approved"></span><span className="text">Approved</span></p>
                        </div>
                        <ShareScreenModal isOpen={this.state.isOpen} closeModal={this.hideModal} screenId={screenId} projectId={projectId} screen={'preview'} />
                        {/* <div className="container" id="img_cont" style={{ backgroundImage: `url(${this.state.screenDetails.image})` }}> */}
                        <div className="container" id="img_cont" >
                            {this.state.screenDetails.image ?
                                <img src={this.state.screenDetails.image} alt="cat" id="image" />
                                : null}
                        </div>
                        <div className="bottom_bar" >
                            <ul className="project-navigation">
                                <li className="list-item">
                                    <Link to={`/project/${projectId}/screens`} className="home">
                                        Screens
                                    </Link>
                                </li>
                                <li className="list-item">
                                    <a className="right">{this.state.screenDetails.name}</a>
                                </li>
                            </ul>
                            <div className="console-modes" >
                                <ul className="project-navigation">
                                    <li className="list-item preview-mode active" style={{ padding: 0 }}>
                                        <Link to={`/project/${projectId}/screen/${screenId}/preview`} className="preview home"></Link>
                                    </li>
                                    <li className="list-item comment-mode" style={{ padding: 0 }}>
                                        <a onClick={() => this.pageloader(`/project/${projectId}/screen/${screenId}/comments`)} className="comment"></a>
                                    </li>
                                </ul>
                            </div>
                            <ul className="buttons">
                                <a className="button share" onClick={this.openModal}>
                                    <span>Share</span>
                                </a>
                            </ul>
                            <ul className="settings">
                                <li className="list-item" >
                                    <p onClick={() => { this.statusBox() }} id="top_status" className={this.state.screenDetails.notification_status} title="SCREEN STATUS"></p>
                                </li>
                            </ul>
                        </div>
                    </div >
                }
            </div >
        );
    }
}

export default preview;