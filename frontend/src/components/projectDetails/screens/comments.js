import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Link } from 'react-router';
import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';
import { Spinner } from '../../../utils/functionComponent'
import ShareScreenModal from './ShareScreenModal';
import LocalStorageUtils from "../../../utils/LocalStorageUtils";
import constatns from "../../../constatns";

let io;
if (socketIOClient.sails) {
    io = socketIOClient;
} else {
    io = sailsIOClient(socketIOClient);
}

class comments extends React.Component {

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
            close: true,
            screenDetails: [],
            memberData: [],
            isLoading: true,
            statusBox: false,
            displayPopover: false,
            displayPopoverIcon: false,
        };

        io.sails.url = `${process.env.REACT_APP_SAILS_SOCKET_URL}`;
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
        this.displayComment();
        io.socket.on('circle', function (cmt) {
            let commentsUptoNow = this.state.commentsUptoNow;
            commentsUptoNow.push(cmt);
            this.setState({
                commentsUptoNow: commentsUptoNow,
            });
        }.bind(this));

        io.socket.on('updateChat', function (cmt) {
            this.setState({
                commentList: cmt[0].comments,
            });
        }.bind(this));
    }

    sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    fetchScreenDetails() {
        let { params: { projectId, screenId } } = this.props;
        let { loggedInUser: [userData] } = this.state;
        let { id } = userData;
        let listUrl = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}comment/list`;
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

        io.socket.get(listUrl, { 'screen_id': screenId }, function (res, jwres) {
            if (jwres.statusCode === 200 && jwres.body.status === 'OK') {
                this.setState({
                    commentsUptoNow: res.result.comments,
                    projectId: projectId,
                    userId: id,
                });
            } else {
                console.log('Something went wrong with websocket');
            }
        }.bind(this));
    }

    placeBox(e) {
        e.preventDefault();
        this.setState({ displayPopover: true, displayPopoverIcon: true });
        let left = (e.nativeEvent.offsetX - 5);
        let top = (e.nativeEvent.offsetY - 3);
        let coords = this.state.imageCoords;
        if (coords.length > 0) {
            coords.map((e) => {
                if (e.coords !== `${left},${top}`) {
                    this.setState({ commentList: [] });
                }
                return true;
            }
            );
        }
        this.setState({
            style: {
                left: (left) + 'px',
                top: (top) + 'px'
            },
            popoverStyle: {
                left: (left - 18) + 'px',
                top: (top + 35) + 'px'
            },
            x_cords: left,
            y_cords: top,
        });

        this.state.imageCoords.push({ 'coords': `${left},${top}` });
    }

    commentListData(cords, e) {
        let x = parseInt(cords.split(',')[0], 10);
        let y = parseInt(cords.split(',')[1], 10);
        let { params: { projectId, screenId } } = this.props;
        let url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}comment/record`

        io.socket.get(url, { 'project_id': projectId, 'screen_id': screenId, 'x': x, 'y': y }, function (resData, jwres) {
            if (jwres.statusCode === 200 && jwres.body.status === 'ok') {
                //this.setState({ displayPopover: true, displayPopoverIcon: true });
                this.setState({
                    commentList: resData.comments[0].comments,
                    popoverStyle: {
                        left: (x - 18) + 'px',
                        top: (y + 35) + 'px'
                    },
                    x_cords: x,
                    y_cords: y,
                    displayPopover: true, displayPopoverIcon: true
                });
            } else {
                console.log('Something went wrong with websocket');
            }
        }.bind(this));
    }

    displayComment(e) {
        if (e) {
            e.preventDefault();
            let comment = this.refs.comment.value;
            this.refs.comment.value = '';
            let { commentList, userId } = this.state;
            let { params: { projectId, screenId } } = this.props;
            if (comment !== '') {
                commentList.push({ 'comment': comment, 'member_id': userId, createdAt: new Date() }, );
            }
            io.socket.post('/api/comment/chat', { 'comments': commentList, 'project_id': projectId, 'screen_id': screenId, 'x_cords': this.state.x_cords, 'y_cords': this.state.y_cords, 'user_id': userId });
            io.socket.on('createChat', function (cmt) {
                let { commentsUptoNow } = this.state;
                this.setState({
                    commentList: cmt.comments,
                    commentsUptoNow: commentsUptoNow,
                });
            }.bind(this));
        }
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

    commentsList() {
        let { commentList } = this.state;
        let { loggedInUser: [userData] } = this.state;
        let { email } = userData;
        let list = [];

        commentList.length > 0 ?
            commentList.map((comment, i) => {
                list.push(
                    <div key={i}>
                        <h4>{comment.email === email ? 'You' : `${comment.first_name} ${comment.last_name}`}</h4>
                        <p>{comment.comment}</p>
                    </div>
                )
            })
            : null;

        return list;
    }

    circleList() {
        let { commentsUptoNow } = this.state;
        let circle = [];

        commentsUptoNow.length > 0 ?
            commentsUptoNow.map((comment, i) => {
                circle.push(
                    <div className="circle" key={i}
                        onClick={this.commentListData.bind(this, `${comment.x_cords},${comment.y_cords}`)}
                        style={{ 'left': comment.x_cords + 'px', 'top': comment.y_cords + 'px' }}>
                    </div>
                );
            }) : null;

        return circle;
    }

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

    closeCommentModel() {
        this.setState({
            close: false
        })
    }

    render() {
        let commentsList = this.commentsList();
        let circleList = this.circleList();
        let { params: { projectId, screenId } } = this.props;
        let { statusBox, displayPopover, displayPopoverIcon, popoverStyle: { left, top } } = this.state;
        let popoverIconLeft = this.state.style.left ? this.state.style.left : 0;
        let popoverIconTop = this.state.style.top ? this.state.style.top : 0;

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
                        <ShareScreenModal isOpen={this.state.isOpen} closeModal={this.hideModal} screenId={screenId} projectId={projectId} screen={'comments'} />
                        {/* <div className="container" id="img_cont" style={{ backgroundImage: `url(${this.state.screenDetails.image})` }}> */}
                        <div className="container" id="img_cont" >
                            <div className="container-image" >
                                {this.state.screenDetails.image ?
                                    <img src={this.state.screenDetails.image} alt="cat" id="image" onClick={this.placeBox.bind(this)} />
                                    : null}
                                {circleList}
                                <div className='circle' style={{ left: popoverIconLeft, top: popoverIconTop, display: displayPopover ? 'block' : 'none' }}></div>
                                <div className={this.state.displayPopover === false ? '' : 'popover'} style={{ left: left, top: top, display: displayPopover ? 'block' : 'none' }}>
                                    <div className="popover-arrow"></div>
                                    <div>
                                        <span>Leave a comment</span>
                                        <span className="closeIcon" onClick={() => this.setState({ displayPopover: false })}>&#10006;</span>
                                    </div>
                                    <div ref="commentlist">{commentsList}</div>
                                    <ul ref="commentlists" id="commentList" style={{ 'listStyleType': 'none' }}></ul>
                                    <textarea ref="comment" className="comment-textarea" placeholder="Add a new comment"></textarea>
                                    <input type="button" className="btn-send" onClick={this.displayComment.bind(this)} value="send" />
                                </div>
                            </div>
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
                                    <li className="list-item preview-mode" style={{ padding: 0 }}>
                                        <Link to={`/project/${projectId}/screen/${screenId}/preview`} className="preview home"></Link>
                                    </li>
                                    <li className="list-item comment-mode active" style={{ padding: 0 }}>
                                        <Link to={`/project/${projectId}/screen/${screenId}/comments`} className="comment"></Link>
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

export default comments;