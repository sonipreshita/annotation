import React from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { topMenuBar, noRecordFound, Spinner } from '../../../utils/functionComponent';
import { timeDifference } from '../../../utils/dateHelper';
import axios from 'axios';
const maxHeight = 600;
const minHeight = 50;
const TEXT_LENGTH = 30;
//const DEFAULT_USER_IMAGE = `http://mymdpms.com/files/users/11efe7068ab5e8faca7f87d4d06579ad_1522763556.jpg`;

class comments extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            commentsData: [],
            isLoading: true
        }
    }

    componentDidMount() {
        this.fetchRecord();
    }

    fetchRecord() {
        let { params: { projectId } } = this.props;
        var url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}comments-list?project_id=${projectId}`;
        axios.get(url)
            .then(response => {
                let { data: { result } } = response;
                this.setState({
                    commentsData: result,
                    isLoading: false
                });
            }).catch(error => {
                this.setState({
                    isLoading: false
                });
            });
    }

    handleOnKeyPress(e) {
        if (e.target.value) {
            const query = e.target.value.trim();
            if (query !== '') {
                this.searchComments(query);
            } else {
                this.fetchRecord();
            }
        } else {
            this.fetchRecord();
        }
    }

    searchComments(query) {
        let { params: { projectId } } = this.props;
        var url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}comments/search_query?commentQuery=${query}&project_id=${projectId}`;
        axios.get(url)
            .then(response => {
                let { data: { result } } = response;
                this.setState({
                    commentsData: result,
                });
            }).catch(error => { console.log('error :', error) });
    }

    commentsList() {
        let { commentsData } = this.state;
        return commentsData && commentsData.comments && commentsData.comments.length > 0 ?
            commentsData.comments.reverse().map((data, key) => {
                //let { project_id, screen_id, user_id } = data;
                let { comments } = data;
                let { x_cords, y_cords } = data;
                return comments && comments.length > 0 &&
                    comments.map((comment, key) => {
                        let { screen_id: { image, name }, user_id: { first_name, last_name } } = data;
                        let firstName = first_name ? first_name : null;
                        let lastName = last_name ? last_name : null;
                        let userName = `${firstName} ${lastName}`;
                        return (
                            <div className="conversation" key={key}>
                                <div className="thumb" style={{ backgroundColor: 'rgb(106, 157, 210)' }}>
                                    <div className="composite">
                                        <div className="marker" style={{ left: (x_cords) + 'px', top: (y_cords) + 'px',position:'inline' }}></div>
                                        <img src={image} alt={name} />
                                    </div>
                                </div>
                                <div className="participants">
                                    <ul>
                                        <li className="latest">
                                            <span className="m-avatar" style={{ height: 36, width: 36, background: 'none' }}>
                                                <img alt="loading" src="/img/sample.jpg" style={{ display: 'block', width: 36, height: 36 }} />
                                            </span>
                                        </li>
                                    </ul>
                                    <p >
                                        {userName}
                                    </p>
                                </div>
                                <div className="text" >
                                    <div className="vertical-wrap">
                                        <span >{comment.comment ? comment.comment.substring(0, TEXT_LENGTH) + (comment.comment.length > TEXT_LENGTH ? '...' : '') : ''}</span>
                                    </div>
                                </div>
                                <div className="date">
                                    <p >{timeDifference(comment.createdAt)}</p>
                                </div>
                            </div>
                        )
                    })
            }) : noRecordFound(`No comments found.`);
    }

    render() {
        let { params: { projectId } } = this.props;
        let commentsList = this.commentsList();

        return (
            <div className="screens-main" >
                <div className="screen-head">
                    <div className="screens-main-div">
                        {topMenuBar('comments', projectId)}
                    </div>
                </div >
                <br />
                <div className="search" >
                    <input id="search"
                        type="search"
                        placeholder="Search comments..."
                        onChange={this.handleOnKeyPress.bind(this)}
                    />
                </div>
                <br />
                <br />
                <div className="conversations" style={{
                    maxHeight: maxHeight,
                    minHeight: minHeight,
                    overflow: 'auto'
                }}>
                    {this.state.isLoading ? <Spinner /> : commentsList}
                </div>
            </div>
        );
    }
}

export default comments;