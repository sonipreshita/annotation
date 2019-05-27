import React from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { topMenuBar, Spinner } from '../../../utils/functionComponent';
import axios from 'axios';
import { toast } from 'react-toastify';
import constatns from "../../../constatns";
import LocalStorageUtils from "../../../utils/LocalStorageUtils";
const maxHeight = 250;
const minHeight = 50;
const TEXT_LENGTH = 10;

class workflow extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            newScreen: [],
            progressScreen: [],
            onholdScreen: [],
            approvedScreen: [],
            isLoading: true
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
        this.fetchRecord();
    }

    fetchRecord() {
        let { params: { projectId } } = this.props;
        var url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}screen_workflow?project_id=${projectId}`;
        axios.get(url)
            .then(response => {
                let { data: { screenData: { newScreen, progressScreen, onholdScreen, approvedScreen } } } = response;
                this.setState({
                    newScreen: newScreen,
                    progressScreen: progressScreen,
                    onholdScreen: onholdScreen,
                    approvedScreen: approvedScreen,
                    isLoading: false
                });
            }).catch(error => {
                this.setState({
                    isLoading: false
                });
                console.log('error ', error)
            });
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

    onDragStart = (ev, id, status) => {
        ev.dataTransfer.setData("id", id);
        ev.dataTransfer.setData("oldStatus", status);
    }

    onDrop = (ev, status) => {
        let id = ev.dataTransfer.getData("id");
        let oldStatus = ev.dataTransfer.getData("oldStatus");
        if (oldStatus !== status) {
            this.statusChangeScreen(id, status)
        }
    }

    onDragOver = (ev) => {
        ev.preventDefault();
    }

    newWorkflow() {
        let { newScreen } = this.state;

        return (
            <div className="swimlane">
                <div className="swimlane-color status-new" ></div>
                <div className="swimlane-header">
                    <h3 className="swimlane-title clearfix">
                        <div className="rename-swimlane">
                            <div className="title" >New</div>
                            <div className="count"><span>(</span><span >{newScreen.length ? newScreen.length : 0}</span><span>)</span></div>
                        </div>
                    </h3>
                </div>
                <div style={{
                    maxHeight: maxHeight,
                    minHeight: minHeight
                }}
                    onDragOver={(e) => this.onDragOver(e)}
                    onDrop={(e) => this.onDrop(e, constatns.NEW)} className="fill-remaining-height scrollbars workflow-cards-scroll-wrapper is-scrollable" >
                    <ul className="card-wrapper droppable" >
                        {newScreen && newScreen.length > 0 ?
                            newScreen.map((screen, key) => {
                                return (
                                    <li className="card" key={key} draggable onDragStart={(e) => this.onDragStart(e, screen.id, screen.notification_status)}>
                                        <div className="thumbnail" style={{ backgroundPosition: 'initial', backgroundImage: `url(${screen.image})` }}></div>
                                        <div className="content"><span className="title">{screen.name ? screen.name.substring(0, TEXT_LENGTH) + (screen.name.length > TEXT_LENGTH ? '...' : '') : ''} </span></div>
                                    </li>
                                )
                            }) : null}
                    </ul>
                </div>
            </div >
        )
    }


    inprogressWorkflow() {
        let { progressScreen } = this.state;

        return (
            <div className="swimlane">
                <div className="swimlane-color status-inprogress" ></div>
                <div className="swimlane-header">
                    <h3 className="swimlane-title clearfix">
                        <div className="rename-swimlane">
                            <div className="title" >Inprogress</div>
                            <div className="count"><span>(</span><span >{progressScreen.length ? progressScreen.length : 0}</span><span>)</span></div>
                        </div>
                    </h3>
                </div>
                <div style={{
                    maxHeight: maxHeight,
                    minHeight: minHeight
                }}
                    onDragOver={(e) => this.onDragOver(e)}
                    onDrop={(e) => this.onDrop(e, constatns.IN_PROGRESS)}
                    className="fill-remaining-height scrollbars workflow-cards-scroll-wrapper is-scrollable" >
                    <ul className="card-wrapper droppable" >
                        {progressScreen && progressScreen.length > 0 ?
                            progressScreen.map((screen, key) => {
                                return (
                                    <li className="card" key={key} draggable onDragStart={(e) => this.onDragStart(e, screen.id, screen.notification_status)}>
                                        <div className="thumbnail" style={{ backgroundPosition: 'initial', backgroundImage: `url(${screen.image})` }}></div>
                                        <div className="content"><span className="title">{screen.name ? screen.name.substring(0, TEXT_LENGTH) + (screen.name.length > TEXT_LENGTH ? '...' : '') : ''} </span></div>
                                    </li>
                                )
                            }) : null}
                    </ul>
                </div>
            </div >
        )
    }

    onholdWorkflow() {
        let { onholdScreen } = this.state;

        return (
            <div className="swimlane">
                <div className="swimlane-color status-on-hold" ></div>
                <div className="swimlane-header">
                    <h3 className="swimlane-title clearfix">
                        <div className="rename-swimlane">
                            <div className="title" >OnHold</div>
                            <div className="count"><span>(</span><span >{onholdScreen.length ? onholdScreen.length : 0}</span><span>)</span></div>
                        </div>
                    </h3>
                </div>
                <div style={{
                    maxHeight: maxHeight,
                    minHeight: minHeight
                }}
                    onDragOver={(e) => this.onDragOver(e)}
                    onDrop={(e) => this.onDrop(e, constatns.ON_HOLD)}
                    className="fill-remaining-height scrollbars workflow-cards-scroll-wrapper is-scrollable" >
                    <ul className="card-wrapper"  >
                        {onholdScreen && onholdScreen.length > 0 ?
                            onholdScreen.map((screen, key) => {
                                return (
                                    <li className="card" key={key} draggable onDragStart={(e) => this.onDragStart(e, screen.id, screen.notification_status)}>
                                        <div className="thumbnail" style={{ backgroundPosition: 'initial', backgroundImage: `url(${screen.image})` }}></div>
                                        <div className="content"><span className="title">{screen.name ? screen.name.substring(0, TEXT_LENGTH) + (screen.name.length > TEXT_LENGTH ? '...' : '') : ''} </span></div>
                                    </li>
                                )
                            }) : null}
                    </ul>
                </div>
            </div >
        )
    }

    approvedWorkflow() {
        let { approvedScreen } = this.state;

        return (
            <div className="swimlane">
                <div className="swimlane-color status-approved" ></div>
                <div className="swimlane-header">
                    <h3 className="swimlane-title clearfix">
                        <div className="rename-swimlane">
                            <div className="title" >Approved</div>
                            <div className="count"><span>(</span><span >{approvedScreen.length ? approvedScreen.length : 0}</span><span>)</span></div>
                        </div>
                    </h3>
                </div>
                <div style={{
                    maxHeight: maxHeight,
                    minHeight: minHeight
                }}
                    onDragOver={(e) => this.onDragOver(e)}
                    onDrop={(e) => this.onDrop(e, constatns.APPROVED)}
                    className="fill-remaining-height scrollbars workflow-cards-scroll-wrapper is-scrollable" >
                    <ul className="card-wrapper droppable" >
                        {approvedScreen && approvedScreen.length > 0 ?
                            approvedScreen.map((screen, key) => {
                                return (
                                    <li className="card" key={key} draggable onDragStart={(e) => this.onDragStart(e, screen.id, screen.notification_status)}>
                                        <div className="thumbnail" style={{ backgroundPosition: 'initial', backgroundImage: `url(${screen.image})` }}></div>
                                        <div className="content"><span className="title">{screen.name ? screen.name.substring(0, TEXT_LENGTH) + (screen.name.length > TEXT_LENGTH ? '...' : '') : ''} </span></div>
                                    </li>
                                )
                            }) : null}
                    </ul>
                </div>
            </div >
        )
    }

    render() {
        let { params: { projectId } } = this.props;
        let newWorkflow = this.newWorkflow();
        let inprogressWorkflow = this.inprogressWorkflow();
        let onholdWorkflow = this.onholdWorkflow();
        let approvedWorkflow = this.approvedWorkflow();

        return (
            <div className="screens-main">
                <div className="screen-head">
                    <div className="screens-main-div">
                        {topMenuBar('workflow', projectId)}
                    </div>
                </div >
                <br />
                <br />
                <div className="project_workflow">
                    {this.state.isLoading ? <Spinner /> : null}
                    {!this.state.isLoading && newWorkflow}
                    {!this.state.isLoading && inprogressWorkflow}
                    {!this.state.isLoading && onholdWorkflow}
                    {!this.state.isLoading && approvedWorkflow}
                </div>
            </div>
        );
    }
}
export default workflow;