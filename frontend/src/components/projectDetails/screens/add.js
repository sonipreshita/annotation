import React from 'react';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import { toast } from 'react-toastify';
import { checkImageTypeAndSize } from "../../../utils/ImageService";
import LocalStorageUtils from "../../../utils/LocalStorageUtils";

class Add extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fields: {},
            error: {},
            filesToBeSent: [],
            filesPreview: null,
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
                filesPreview.push(<div key={1}>{filesToBeSent[0][0].name}</div>)
                this.setState({ filesToBeSent, filesPreview, error: error });
            }
            else {
                alert("You have reached the limit of uploading files at a time.")
            }
        }
    }

    componentDidMount() {
        let getLoggedInUser = LocalStorageUtils.get('LoggedInUser');
        if (getLoggedInUser) {
            this.setState({
                loggedInUser: JSON.parse(getLoggedInUser)
            });
        }
    };

    sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    formSubmit(e) {
        e.preventDefault();
        if (this.handleValidation()) {
            let { projectId } = this.props;
            let { loggedInUser: [userData, token] } = this.state;
            let { id } = userData;
            let { fields } = this.state;
            let { filesToBeSent: [imageFile] } = this.state;
            let [image] = imageFile;
            let url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}screen/create/${projectId}`;
            let form = new FormData();
            form.append('project_id', projectId);
            form.append('user_id', id);
            form.append('screen_name', fields['screenName']);
            form.append('uploadFile', image);
            let header = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            };
            axios.post(url, form, header)
                .then(response => {
                    if (response.status === 200 && response.statusText === 'OK') {
                        let message = response.data.result.message ? response.data.result.message : 'Screen addded successfully.';
                        toast.success(message);
                        this.sleep(1000).then(() => {
                            this.refs.screenName.value = null;
                            this.setState({
                                fields: {}, error: {}, filesToBeSent: [], filesPreview: null
                            })
                            window.location.href = `/project/${projectId}/screens`;
                        })
                    }
                }).catch(error => {
                    if (error && error.response && error.response.data && error.response.data.status) {
                        let message = error.response.data.status === 'NOK' ? error.response.data.result.message : 'Something went wrong.';
                        toast.error(message);
                    } else {
                        toast.error('Invalid Request');
                    }
                })
        }
    }

    changeHandler(field, e) {
        let { fields } = this.state;
        let { error } = this.state;
        fields[field] = e.target.value;
        error[field] = false;
        this.setState({ error, fields });
    }

    handleValidation() {
        let formValid = true;
        let { fields } = this.state;
        let { error } = this.state;

        if (!fields['screenName']) {
            formValid = false;
            error['screenName'] = true;
        }

        if (this.state.filesToBeSent.length === 0) {
            formValid = false;
            error['imageFile'] = true;
        }

        this.setState({ error });
        return formValid;
    }

    render() {
        return (
            <div>
                <br />
                <input type="text" onChange={this.changeHandler.bind(this, 'screenName')} ref="screenName" className="screenName" name="screenName" placeholder="Screen name" />
                {(this.state.error['screenName'] === true) ? <span className="err-text-change">This field is required.</span> : ''}<br /><br />
                <Dropzone name="uploadFile" onDrop={(files) => this.onDrop(files)}>
                    {(this.state.filesToBeSent.length !== 0) ? <img width='200px' height='200px' alt='' src={this.state.filesToBeSent[0][0].preview} /> : <img width='195px' height='195px' alt='Upload Image' src='/img/upload_image.png' />}
                </Dropzone>
                {(this.state.error['imageFile'] === true) ? <span className="err-text-change">This field is required.</span> : ''}
                <br />
                <p className="ptag">
                    {this.state.filesPreview}
                </p>
                <div className="react-confirm-alert-button-group">
                    <button onClick={this.formSubmit.bind(this)}>Add</button>
                </div>
            </div>
        );
    }
}
export default Add;