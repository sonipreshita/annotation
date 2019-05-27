import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import CreateProject from './add';
import EditProject from './edit';
// import ProjectPage from './projectPage';
import { Link } from 'react-router';
import constatns from "../../constatns";
import ShareModel from "../projectDetails/screens/ShareScreenModal";
import { noRecordFound, Spinner } from '../../utils/functionComponent'

class Project extends React.Component {

    constructor() {
        super();
        this.state = {
            userAuth: false,
            projecList: [],
            limit: 3,
            isShowingModal: false,
            isLoading: true,
            projectId: "",
            isOpen: false
        }
    }

    loadMore() {
        this.setState({
            limit: this.state.limit + 3
        });
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
    }

    componentDidMount() {
        this.fetchRecord();
    }

    fetchRecord() {
        var data = this.state.loggedInUser;
        var userId = data[0]['id'];
        var url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}project/record?user_id=${userId}`;
        axios.get(url)
            .then(response => {
                let { data: { result: { project } } } = response;
                this.setState({
                    projecList: project,
                    isLoading: false
                });
            }).catch(error => {
                console.log('error', error)
                this.setState({ isLoading: false });
                // if (error && error.response && error.response.data && error.response.data.status) {
                //     toast.error(error.response.data.status === 'NOK' ? error.response.data.result.message : '');
                // } else {
                //     toast.error('Invalid Request');
                // }
            });
    }

    deleteConfirm = (id) => {
        confirmAlert({
            title: 'Confirm',
            message: 'Are you sure to delete?',
            confirmLabel: 'Confirm',
            cancelLabel: 'Cancel',
            onConfirm: () => this.handleDeleteproject(id),
            onCancel: () => ''
        })
    };

    editProjectModal = (id) => {
        confirmAlert({
            title: 'Update Project',
            message: <EditProject projectId={id} />,
            confirmLabel: '',
            cancelLabel: 'Cancel',
            onConfirm: () => '',
            onCancel: () => ''
        })
    };

    createProjectModal = () => {
        confirmAlert({
            title: 'Create Project',
            message: <CreateProject />,
            confirmLabel: '',
            cancelLabel: 'Cancel',
            onConfirm: () => '',
            onCancel: () => ''
        })
    };

    sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    handleDeleteproject(id) {
        var url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}project/delete`;
        var data = this.state.loggedInUser;
        var token = data[1];
        var header = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }
        var form = new FormData();
        form.append('project_id', id);
        axios.post(url, form, header)
            .then(response => {
                toast.success(response.data.result.message);
                this.sleep(1000).then(() => {
                    window.location.href = '/projects';
                })
            })
            .catch(error => {
                if (error && error.response && error.response.data && error.response.data.status) {
                    toast.error(error.response.data.status === 'NOK' ? error.response.data.result.message : '');
                } else {
                    toast.error('Invalid Request');
                }
            });
    }

    shareProject(projectId) {
        this.setState({
            projectId: projectId, isOpen: true
        })
    }

    closeModal() {
        this.setState({
            isOpen: false
        })
    }

    duplicateProjectModal = (projectId) => {
        confirmAlert({
            title: 'Confirm',
            message: 'Are you sure want to duplicate this project?',
            confirmLabel: 'Yes',
            cancelLabel: 'No',
            onConfirm: () => this.duplicateProject(projectId),
            onCancel: () => ''
        })
    };

    duplicateProject(projectId) {
        let url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}project_duplicate/${projectId}`;
        let { loggedInUser: [userData, token] } = this.state;
        let { id } = userData;
        let header = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }
        let form = new FormData();
        form.append('project_id', projectId);
        form.append('user_id', id);
        axios.post(url, form, header)
            .then(response => {
                let message = response.data.result.message ? response.data.result.message : 'Create a duplicate project successfully.';
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

    statusChangeProjectModal = (projectId) => {
        confirmAlert({
            title: 'Confirm',
            message: 'Are you sure want to change the status?',
            confirmLabel: 'Yes',
            cancelLabel: 'No',
            onConfirm: () => this.statusChangeProject(projectId),
            onCancel: () => ''
        })
    };

    statusChangeProject(projectId) {
        let url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}project/change_status`;
        let { loggedInUser: [token] } = this.state;
        let header = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }
        let form = new FormData();
        form.append('id', projectId);
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
        var url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}projects/search_query?projectQuery=${query}`;
        axios.get(url)
            .then(response => {
                let { data: { project } } = response;
                this.setState({
                    projecList: project,
                });
            }).catch(error => { console.log('error', error) });
    }

    projectsList() {
        let { projecList } = this.state;
        return projecList && projecList.length > 0 ?
            projecList.map((project, i) => {
                return (
                    <div key={i} className="blog project_blog">
                        <Link to={`/project/${project.id}/screens`} ><img src={project.image} alt="project" /></Link>
                        <p>{project.name ? project.name.substring(0, 18) + (project.name.length > 18 ? '...' : '') : ''}<span> (count)</span></p>
                        <div className="hoverable">
                            <button onClick={() => this.editProjectModal(project.id)}><i className="fa fa-pencil fa-2x" aria-hidden="true"></i></button>
                            <button onClick={() => this.shareProject(project.id)}><i className="fa fa fa-share fa-2x" aria-hidden="true"></i></button>
                            <button onClick={() => this.duplicateProjectModal(project.id)}><i className="fa fa-clone fa-2x" aria-hidden="true"></i></button>
                            <button onClick={() => this.statusChangeProjectModal(project.id)}><i className="fa fa-file-archive-o fa-2x" aria-hidden="true"></i></button>
                            <button onClick={() => this.deleteConfirm(project.id)}><i className="fa fa-trash fa-2x" aria-hidden="true"></i></button>
                        </div>
                    </div>
                )
            }) : noRecordFound();
    }

    render() {
        const projectsList = this.projectsList();

        return (
            <div className="project_list">
                <div className="head">
                    <h2>Projects</h2>
                    <div className="add_project">
                        <button onClick={() => this.createProjectModal()}><span><i className="fa fa-plus" aria-hidden="true"></i> </span>
                            <span> Start a new project</span>
                        </button>
                    </div>
                </div>
                <br />
                <div className="search" >
                    <input id="search"
                        type="search"
                        placeholder="Search project..."
                        onChange={this.handleOnKeyPress.bind(this)}
                    />
                </div>
                <br />
                <br />
                <div className="row">
                    {this.state.isLoading ? <Spinner /> : projectsList}
                </div>
                <ShareModel isOpen={this.state.isOpen} closeModal={this.closeModal.bind(this)} projectId={this.state.projectId} />
            </div>
        );
    }
}
export default Project;