import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import 'react-confirm-alert/src/react-confirm-alert.css';
import ShareProject from './share';
import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';

const io = sailsIOClient(socketIOClient);

class ProjectPage extends React.Component {

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
            projectId: '',
            userId: '',
            projectDetails: [],
            memberData: []
        };

        io.sails.url = 'http://localhost:1337';
    }

    componentWillMount() {
        let getLoggedInUser = localStorage.getItem('LoggedInUser');
        if (getLoggedInUser != null) {
            this.setState({
                userAuth: true,
                loggedInUser: JSON.parse(getLoggedInUser)
            });
        } else {
            window.location.href = '/login';
        }

        let parseUserData = JSON.parse(getLoggedInUser);
        var projectId = this.props.params.id;
        var userId = parseUserData[0].id;
        var listUrl = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}comment/list`;
        var recordUrl = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}project/record/${projectId}`;

        axios.get(recordUrl)
            .then(response => {
                if (response && response.status === 200) {
                    this.setState({
                        projectDetails: response.data.result.project
                    });
                } else {
                    toast.error('Something went wrong.');
                }
            })
            .catch(error => {console.log('error ',error)});

        io.socket.get(listUrl, { 'project_id': projectId }, function (res, jwres) {
            if (jwres.statusCode === 200 && jwres.body.status === 'OK') {
                this.setState({
                    commentsUptoNow: res.result.comments,
                    projectId: projectId,
                    userId: userId,
                });
            } else {
                console.log('Something went wrong with websocket');
            }
        }.bind(this));
    }

    componentDidMount() {
        this.displayComment();

        io.socket.on('circle', function (cmt) {
            var commentsUptoNow = this.state.commentsUptoNow;
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

    placeBox(e) {
        e.preventDefault();

        var left = (e.nativeEvent.offsetX - 5);
        var top = (e.nativeEvent.offsetY - 3);
        var coords = this.state.imageCoords;
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

    commentList(cords, e) {
        var x = parseInt(cords.split(',')[0], 10);
        var y = parseInt(cords.split(',')[1], 10);
        var projId = this.state.projectId;
        // var uId = this.state.userId;
        var url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}comment/record`

        io.socket.get(url, { 'projId': projId, 'x': x, 'y': y }, function (resData, jwres) {
            if (jwres.statusCode === 200 && jwres.body.status === 'ok') {
                this.setState({
                    commentList: resData.comments[0].comments,
                    popoverStyle: {
                        left: (x - 18) + 'px',
                        top: (y + 35) + 'px'
                    },
                    x_cords: x,
                    y_cords: y,
                });
            } else {
                console.log('Something went wrong with websocket');
            }
        }.bind(this));
    }

    displayComment(e) {
        if (e) {
            e.preventDefault();

            var comment = this.refs.comment.value;
            this.refs.comment.value = '';
            var commentData = this.state.commentList;
            if (comment !== '') {
                commentData.push({ 'comment': comment, 'member_id': this.state.userId }, );
            }
            io.socket.post('/api/comment/chat', { 'comments': commentData, 'project_id': this.state.projectId, 'x_cords': this.state.x_cords, 'y_cords': this.state.y_cords, 'user_id': this.state.userId });

            io.socket.on('createChat', function (cmt) {
                var commentsUptoNow = this.state.commentsUptoNow;
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

    render() {
        var list = [];
            (this.state.commentList.length !== 0) ?
                this.state.commentList.map((comment, i) => {
                    return list.push(<div key={i}>
                            <h4>{
                                (comment.email === this.state.loggedInUser[0].email)
                                    ? 'You'
                                    : `${ comment.first_name } ${comment.last_name}`
                                }
                            </h4>
                        <p>{comment.comment}</p>
                    </div>)
                }) : ''

        var circle = [];
        this.state.commentsUptoNow.map((comment, i) => {
            return circle.push(<div className="circle" key={i} onClick={this.commentList.bind(this, `${comment.x_cords},${comment.y_cords}`)} style={{ 'left': comment.x_cords + 'px', 'top': comment.y_cords + 'px' }}></div>);
        });

        return (
            <div className="project_page">
                <div className="top_head">
                    <Link to="/projects"><button className="back"><i className="fa fa-step-backward" aria-hidden="true"></i> Back</button></Link>
                    <div className="right_section">
                        <p id="top_status" className="top_status" title="SCREEN STATUS"></p>
                        <button className="share" onClick={this.openModal}><i className="fa fa-share" aria-hidden="true"></i> Share</button>
                    </div>
                </div>
                <div className="status">
                    <p className="status_p"><span className="icon on_hold"></span><span className="text">On hold</span></p>
                    <p className="status_p"><span className="icon in_progress"></span><span className="text">in progress</span></p>
                    <p className="status_p"><span className="icon needs_review"></span><span className="text">needs review</span></p>
                    <p className="status_p"><span className="icon approved"></span><span className="text">approved</span></p>
                </div>
                <ShareProject isOpen={this.state.isOpen} closeModal={this.hideModal} projId={this.state.projectDetails.id} />
                <div className="container" id="img_cont">
                    {<img src={this.state.projectDetails.image} alt="cat" id="image" onClick={this.placeBox.bind(this)} />}
                    {circle}
                    <div className="circle" style={this.state.style}></div>
                    <div className="popover" style={this.state.popoverStyle}>
                        <div className="popover-arrow"></div>
                        <div><span>Leave a comment</span></div>
                        <div ref="commentlist">{(list !== '') ? list : ''}</div>
                        <ul ref="commentlists" id="commentList" style={{ 'listStyleType': 'none' }}></ul>
                        <textarea ref="comment" className="comment-textarea" placeholder="Add a new comment"></textarea>
                        <input type="button" className="btn-send" onClick={this.displayComment.bind(this)} value="send" />
                    </div>
                </div>

            </div>
        );
    }
}
export default ProjectPage;