import React from 'react';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import { toast } from 'react-toastify';
import { checkImageTypeAndSize } from "../../utils/ImageService";

class CreateProject extends React.Component {

    constructor() {
        super();
        this.state = {
            formData: [],
            error: [],
            userAuth: false,
            filesToBeSent: [],
            filesPreview: '',
            printcount: 5
        }
    }

    onDrop(acceptedFiles, rejectedFiles) {
        let filesToBeSent = this.state.filesToBeSent;
        let checkImage = checkImageTypeAndSize(acceptedFiles);
        if (checkImage.success) {
            if (filesToBeSent.length < this.state.printcount) {
                let { error } = this.state;
                error['imageFile'] = false;
                filesToBeSent = [];
                filesToBeSent.push(acceptedFiles);
                let filesPreview = [];
                filesPreview.push(<div key={1}>
                    {filesToBeSent[0][0].name}
                </div>
                )
                this.setState({ filesToBeSent, filesPreview, error: error });
            }
            else {
                alert("You have reached the limit of uploading files at a time.")
            }
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
    };

    sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    formSubmit(e) {
        e.preventDefault();
        if (this.handleValidation()) {
            var userData = this.state.loggedInUser;
            var url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}project/create`;
            var token = userData[1];
            var data = this.state.formData;
            var image = this.state.filesToBeSent[0][0];
            var form = new FormData();
            form.append('id', userData[0]['id']);
            form.append('proj_name', data['project_name']);
            form.append('description', data['description']);
            form.append('uploadFile', image);
            var header = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            };
            // this.ImageData();

            axios.post(url, form, header)
                .then(response => {
                    if (response.status === 200 && response.statusText === 'OK') {
                        toast.success(response.data.result.message);
                        this.sleep(1000).then(() => {
                            window.location.reload();
                            window.location.href = '/projects';
                        })
                    }
                }).catch(error => {
                    if (error && error.response && error.response.data && error.response.data.status) {
                        toast.error(error.response.data.status === 'NOK' ? error.response.data.result.message : '');
                    } else {
                        toast.error('Invalid Request');
                    }
                })
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
        var field = this.state.formData;
        var error = this.state.error;

        if (!field['project_name']) {
            formValid = false;
            error['project_name'] = true;
        }
        if (!field['description']) {
            formValid = false;
            error['description'] = true;
        }
        if (this.state.filesToBeSent.length === 0) {
            formValid = false;
            error['imageFile'] = true;
        }

        this.setState({ error: error });
        return formValid;
    }

    render() {
        return (
            <div>
                <br />
                <input type="text" onChange={this.changeHandler.bind(this, 'project_name')} className="project_name" name="project_name" placeholder="Project name" />
                {(this.state.error['project_name'] === true) ? <span className="err-text-change">This field is required.</span> : ''}<br /><br />
                <input type="text" onChange={this.changeHandler.bind(this, 'description')} className="description" name="description" placeholder="What's the project about?" />
                {(this.state.error['description'] === true) ? <span className="err-text-change">This field is required.</span> : ''}<br /><br />
                <Dropzone name="uploadFile" onDrop={(files) => this.onDrop(files)}>
                    {(this.state.filesToBeSent.length !== 0) ? <img width='200px' height='200px' alt='Upload Image' src={this.state.filesToBeSent[0][0].preview} /> : <img width='195px' height='195px' alt='Upload Image' src='/img/upload_image.png' /> }
                    {/* <div>Try dropping some files here, or click to select files to upload.</div> */}
                </Dropzone>
                {(this.state.error['imageFile'] === true) ? <span className="err-text-change">This field is required.</span> : ''}
                <br />
                <p className="ptag">
                    {this.state.filesPreview}
                </p>
                <div className="react-confirm-alert-button-group">
                    <button onClick={this.formSubmit.bind(this)}>Create</button>
                </div>
            </div>
        );
    }
}
export default CreateProject;