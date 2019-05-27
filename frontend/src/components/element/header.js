import React, { Component } from 'react';
import { Link } from 'react-router';
import Forgotpassword from '../profile/forgot-password.js'
//import Login from '../login.js'

class Header extends Component {

    constructor() {
        super()
        this.state = {
            userAuth: false,
            loggedInUser: [],
            toggle: false
        }
    }

    logout() {
        localStorage.clear();
        window.location.href = '/';
    }



    componentWillMount() {
        let getLoggedInUser = localStorage.getItem('LoggedInUser');
        if (getLoggedInUser != null) {
            this.setState({
                userAuth: true,
                loggedInUser: JSON.parse(getLoggedInUser)
            });
        } else {
            //window.location.href = '/';
        }
    };

    toggle() {
        this.setState({
            toggle: !this.state.toggle
        })
    }

    hideToggle() {
        this.setState({
            toggle: false
        })
    }

    render() {
        let { toggle } = this.state;
        let headerDisplay;

        if (!this.state.userAuth) {
            headerDisplay = (
                <div className="register_section">
                    <Link to="/login" className="login loginForm register_link">Login</Link>
                    <Link to="/register" className=" register register_link">Register</Link>
                </div>
            )
        } else {
            let userData = this.state.loggedInUser;
            headerDisplay = (
                <div>
                    <div className="homepage_right_header" onClick={() => this.toggle()}>
                        <p className="profile_name"><span>{userData[0]['first_name']}  {userData[0]['last_name']}</span><i className="fa fa-caret-down" aria-hidden="true"></i></p>
                    </div>
                    <div className="homepage_header_body" style={{ display: toggle ? 'block' : 'none' }}>
                        <div className="blog">
                            <div className="row1">
                                <div className="image">
                                    <img src="/img/sample.jpg" height="70px" width="70px" alt="sample" />
                                </div>
                                <div className="text">
                                    <p className="p_name">{userData[0]['first_name']}</p>
                                    <p className="p_email">{userData[0]['email']}</p>
                                    <Link className="view_profile text-decoration" onClick={this.hideToggle.bind(this)} to="/edit-profile" ><p>View Profile</p></Link>
                                </div>
                            </div>
                            <div className="row2">
                                <Link to="/change-password" onClick={this.hideToggle.bind(this)} className="change_password text-decoration"><p>Change password</p></Link> <br />
                                <Link to="/" className="sign_out" href="" onClick={this.logout.bind(this)}> <p>sign out</p></Link>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div className="header">
                <div className="wrapper">
                    <div className="logo">
                        <Link to="/"><h2>Annotation Tool</h2></Link>
                    </div>
                    {headerDisplay}
                </div>
                <Forgotpassword />
            </div>
        );
    }
}
export default Header;