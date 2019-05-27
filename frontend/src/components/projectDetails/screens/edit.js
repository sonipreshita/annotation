import React from 'react';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import { toast } from 'react-toastify';
import { checkImageTypeAndSize } from "../../../utils/ImageService";
import LocalStorageUtils from "../../../utils/LocalStorageUtils";

class Edit extends React.Component {

    constructor() {
        super();
        this.state = {
            fields: {},
            error: {},
            screenData: [],
            filesToBeSent: [],
            filesPreview: '',
            printcount: 1,
            imagePath: null
        }
    }

    componentDidMount() {
        let getLoggedInUser = LocalStorageUtils.get('LoggedInUser');
        if (getLoggedInUser) {
            this.setState({
                loggedInUser: JSON.parse(getLoggedInUser)
            });
        }

        let { screenId } = this.props;
        let url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}screen/${screenId}`;
        axios.get(url)
            .then(response => {
                let { data: { result: { screen } } } = response;
                let { fields } = this.state;
                fields['screenName'] = screen.name;
                this.refs.screenName.value = screen.name;
                this.setState({ screenData: screen, fields });
            })
            .catch(error => {
            });
    }

    onDrop(acceptedFiles, rejectedFiles) {
        let filesToBeSent = this.state.filesToBeSent;
        let checkImage = checkImageTypeAndSize(acceptedFiles);
        if (checkImage.success) {
            if (filesToBeSent.length < this.state.printcount) {
                filesToBeSent.push(acceptedFiles);
                let filesPreview = [];
                for (let i in filesToBeSent) {
                    filesPreview.push(<div key={i}>{filesToBeSent[i][0].name}</div>)
                }
                this.setState({ filesToBeSent, filesPreview });
            }
            else {
                alert("You have reached the limit of uploading files at a time.")
            }
        }
    }

    changeHandler(field, e) {
        let { fields } = this.state;
        let { error } = this.state;
        fields[field] = e.target.value;
        error[field] = false;
        this.setState({ error: error, fields: fields });
    }

    handleValidation() {
        let formValid = true;
        let { fields } = this.state;
        let { error } = this.state;

        if (!fields['screenName']) {
            formValid = false;
            error['screenName'] = true;
        }

        this.setState({ error });
        return formValid;
    }

    formSubmit(screenId, projectId, e) {
        e.preventDefault();
        if (this.handleValidation()) {
            this.editScreen(screenId, projectId);
        }
    }

    sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    editScreen(screenId, projectId) {
        let { loggedInUser: [userData, token] } = this.state;
        let { id } = userData;
        let { fields } = this.state;
        let url = `${process.env.REACT_APP_API_BASE_URL_ENDPOINT}screen/update`;
        let form = new FormData();
        let image = (this.state.filesToBeSent.length !== 0) ? this.state.filesToBeSent[0][0] : null;
        form.append('project_id', projectId);
        form.append('screen_id', screenId);
        form.append('user_id', id);
        form.append('screen_name', fields['screenName']);
        form.append('uploadFile', image);
        let header = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }

        axios.post(url, form, header)
            .then(response => {
                let message = response.data.result.message ? response.data.result.message : 'Fail to update.';
                toast.success(message);
                this.sleep(1000).then(() => {
                    window.location.href = `/project/${projectId}/screens`;
                })
            })
            .catch(error => {
                if (error && error.response && error.response.data && error.response.data.status) {
                    let message = error.response.data.status === 'NOK' ? error.response.data.result.message : 'Fail to update.';
                    toast.error(message);
                } else {
                    toast.error('Invalid Request');
                }
            });
    }

    render() {
        let { screenData } = this.state;
        return (
            <div className="wrapper">
                <br />
                <input onChange={this.changeHandler.bind(this, 'screenName')} className="screenName" ref="screenName" type="text" placeholder="screen Name" /><br />
                {(this.state.error['screenName'] === true) ? <span className="err-text-change">This field is required.</span> : ''}<br />
                <Dropzone name="uploadFile" onDrop={(files) => this.onDrop(files)} value={(screenData['image']) ? screenData['image'] : ''}>
                    {/* <div>Try dropping some files here, or click to select files to upload.</div> */}
                    {(this.state.filesToBeSent.length !== 0) ?
                        <img width='200px' ref="imagename" alt='' height='200px' src={this.state.filesToBeSent[0][0].preview} />
                        :
                        <img width='200px' ref="imagename" alt='' height='200px' src={screenData['image']} />
                    }
                </Dropzone><br />
                <div>
                    {this.state.filesPreview}
                </div>
                <div className="react-confirm-alert-button-group">
                    <button onClick={this.formSubmit.bind(this, screenData.id, screenData.project_id)}>Update</button>
                </div>
            </div>
        );
    }
}
export default Edit;