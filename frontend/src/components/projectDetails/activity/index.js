import React from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { topMenuBar, noRecordFound, Spinner } from '../../../utils/functionComponent'
import axios from 'axios';
import { formatAMPM, formatDateActivity, dateContinueCheck } from '../../../utils/dateHelper';
import { Link } from 'react-router';
//  const DEFAULT_USER_IMAGE = `http://mymdpms.com/files/users/11efe7068ab5e8faca7f87d4d06579ad_1522763556.jpg`;

class activity extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            activityLogs: []
        }
    }

    componentDidMount() {
        this.fetchRecord();
    }

    fetchRecord() {
        let { params: { projectId } } = this.props;
        var url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}activity-log/${projectId}`;
        axios.get(url)
            .then(response => {
                let { data: { logs } } = response;
                this.setState({
                    activityLogs: logs,
                    isLoading: false
                });
            }).catch(error => {
                this.setState({
                    isLoading: false
                });
            });
    }

    activityList() {
        let { activityLogs } = this.state;
        let checkLastDateStore = null;
        let checkNextDate = null;

        return activityLogs.length > 0 ?
            activityLogs.reverse().map((activity, key) => {
                let firstName = activity.user_id.first_name ? activity.user_id.first_name : null;
                let lastName = activity.user_id.last_name ? activity.user_id.last_name : null;
                let userName = `${firstName} ${lastName}`;
                let checkLastDate = dateContinueCheck(activity.createdAt);
                if (checkLastDateStore !== checkLastDate) {
                    checkLastDateStore = checkLastDate;
                } else {
                    checkNextDate = checkLastDate;
                }
                return (
                    <div className="day" key={key}>
                        {checkLastDateStore !== checkNextDate ?
                            <div className="date">{formatDateActivity(activity.createdAt)}</div>
                            : null}
                        <div className="activity box" >
                            <div className="time ">{formatAMPM(activity.createdAt)}</div>
                            <div className="item" >
                                <div className="description">
                                    <div className="users">
                                        <a className="user">
                                            <span className="m-avatar" style={{ height: 36, width: 36, background: 'none' }}>
                                                <img alt="loading" src="/img/sample.jpg" style={{ display: 'block', width: 36, height: 36 }} />
                                            </span>
                                        </a>
                                    </div>
                                    <h2 >
                                        <span>
                                            <strong >{userName}</strong>&nbsp;
							                <span>{activity.description}</span>
                                        </span>
                                    </h2>
                                </div>
                                {activity.screen_id && activity.screen_id ?
                                    <div className="items-affected" >
                                        <span >
                                            <span>
                                                <div className="screens ">
                                                    <Link to={`/project/${activity.screen_id.project_id}/screen/${activity.screen_id.id}/preview`}>
                                                        <span className="screen" style={{ background: 'rgb(255, 255, 255)' }}>
                                                            <img src={activity.screen_id.image} alt={activity.screen_id.name} />
                                                        </span>
                                                    </Link>
                                                </div>
                                            </span>
                                        </span>
                                    </div> :
                                    activity.project_id && activity.project_id ?
                                        <div className="items-affected" >
                                            <span >
                                                <span>
                                                    <div className="screens ">
                                                        <Link to={`/project/${activity.project_id.id}/screens`}>
                                                            <span className="screen" style={{ background: 'rgb(255, 255, 255)' }}>
                                                                <img src={activity.project_id.image} alt={activity.project_id.name} />
                                                            </span>
                                                        </Link>
                                                    </div>
                                                </span>
                                            </span>
                                        </div> : null
                                }
                            </div>
                        </div>
                    </div>
                )
            }) : noRecordFound(`No activity yet.`);
    }

    render() {
        let { params: { projectId } } = this.props;
        let activityList = this.activityList();

        return (
            <div className="screens-main">
                <div className="screen-head">
                    <div className="screens-main-div">
                        {topMenuBar('activity', projectId)}
                    </div>
                </div >
                <br />
                <br />
                {this.state.isLoading ? <Spinner /> :
                    <div className="activity-feed">
                        {activityList}
                    </div>
                }
            </div>
        );
    }
}

export default activity;