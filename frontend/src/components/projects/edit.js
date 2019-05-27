import React from 'react';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import { toast } from 'react-toastify';
import { checkImageTypeAndSize } from "../../utils/ImageService";

class EditProject extends React.Component {

    constructor() {
        super();
        this.state = {
            formData: [],
            error: [],
            projectData: [],
            filesToBeSent: [],
            filesPreview: '',
            printcount: 1,
            imagePath: null
        }
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

        var id = this.props.projectId;
        var url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}project/record/${id}`;

        axios.get(url)
            .then(response => {
                // console.log(response);
                this.setState({ projectData: response.data.result.project });
                this.refs.projectName.value = response.data.result.project.name;
                this.refs.description.value = response.data.result.project.description;
                this.refs.imagename.value = response.data.result.project.image;
            })
            .catch(error => {
            });
    }

    onDrop(acceptedFiles, rejectedFiles) {
        var filesToBeSent = this.state.filesToBeSent;
        let checkImage = checkImageTypeAndSize(acceptedFiles);
        if (checkImage.success) {
            if (filesToBeSent.length < this.state.printcount) {
                filesToBeSent.push(acceptedFiles);
                var filesPreview = [];
                for (var i in filesToBeSent) {
                    filesPreview.push(<div key={i}>
                        {filesToBeSent[i][0].name}
                    </div>
                    )
                }
                this.setState({ filesToBeSent, filesPreview });
            }
            else {
                alert("You have reached the limit of uploading files at a time.")
            }
        }
    }

    changeHandler(field, e) {
        let formData = this.state.formData;
        let error = this.state.error;
        formData[field] = e.target.value;
        error[field] = false;
        this.setState({ error: error });
    }

    handleValidation() {
        var formValid = true;
        // var field = this.state.formData;
        let projectName = this.refs.projectName.value;
        let description = this.refs.description.value;
        var error = this.state.error;

        if (projectName === null || projectName === '') {
            formValid = false;
            error['projectName'] = true;
        }
        if (description === null || description === '') {
            formValid = false;
            error['description'] = true;
        }

        this.setState({ error: error });
        return formValid;
    }

    formSubmit(id, e) {
        e.preventDefault();
        if (this.handleValidation()) {
            this.handleEditProject(id);
        }
    }

    sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    handleEditProject(id) {
        var url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}project/update`;
        var data = this.state.loggedInUser;
        var userId = data[0]['id'];
        var token = data[1];
        var name = this.refs.projectName.value;
        var desc = this.refs.description.value;
        var image = (this.state.filesToBeSent.length !== 0) ? this.state.filesToBeSent[0][0] : '';
        var form = new FormData();
        form.append('project_id', id);
        form.append('user_id', userId);
        form.append('proj_name', name);
        form.append('description', desc);
        form.append('uploadFile', image);

        var header = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }

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

    render() {
        let data = this.state.projectData;

        return (
            <div className="wrapper">
                <br />
                <input className="project_name" ref="projectName" type="text" placeholder="Project Name" /><br />
                {(this.state.error['projectName'] === true) ? <span className="err-text-change">This field is required.</span> : ''}<br />
                <input className="description" ref="description" type="text" placeholder="What's the project about?" /><br />
                {(this.state.error['description'] === true) ? <span className="err-text-change">This field is required.</span> : ''}<br />
                <Dropzone name="uploadFile" onDrop={(files) => this.onDrop(files)} value={(data['image']) ? data['image'] : ''}>
                    {/* <div>Try dropping some files here, or click to select files to upload.</div> */}
                    {(this.state.filesToBeSent.length !== 0) ?
                        <img width='200px' ref="imagename" alt='' height='200px' src={this.state.filesToBeSent[0][0].preview} />
                        :
                        <img width='200px' ref="imagename" alt='' height='200px' src={data['image']} />
                    }
                </Dropzone><br />
                <div>
                    {this.state.filesPreview}
                </div>
                <div className="react-confirm-alert-button-group">
                    <button onClick={this.formSubmit.bind(this, this.props.projectId)}>Update</button>
                </div>
            </div>
        );
    }
}
export default EditProject;