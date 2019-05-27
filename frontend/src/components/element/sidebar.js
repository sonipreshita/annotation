import React, { Component } from 'react';
import ChangePassword from '../profile/change-password.js'
import { Link } from 'react-router';

class Sidebar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            userAuth: false
        }
    }

    componentWillMount() {
        let getLoggedInUser = localStorage.getItem('LoggedInUser');
        if (getLoggedInUser != null) {
            this.setState({ userAuth: true });
        }
    };

    render() {
        let sidebarDisplay;
        let { location: { pathname } } = this.props;
        let check = pathname.split("/");
        let activeMenu = check[1] ? check[1] : '/';
        if (this.state.userAuth) {
            sidebarDisplay = (
                <div>
                    {/* <div className="navbar">
                        <ul>
                            <li className="dashboard active"><Link className="dashboard navbar-link text-decoration" to="/"><i className="fa fa-dashboard" aria-hidden="true"></i> Dashboard</Link></li>
                            <li className="projects "><Link className="projects text-decoration navbar-link" to="/projects"><i className="fa fa-file-code-o" aria-hidden="true"></i> Projects</Link></li>
                            <li className="people"><Link to="/members" className="people navbar-link text-decoration"><i className="fa fa-users" aria-hidden="true"></i> Members</Link></li>
                            <li className="create_team"><Link to="/team" className="create_team navbar-link text-decoration"><i className="fa fa-users" aria-hidden="true"></i> Team</Link></li>
                        </ul>
                    </div> */}
                    <div className="navbar">
                        <ul>
                            <li className='dashboard'>
                                <Link className={activeMenu === '/' ? 'navbar-link text-decoration active' : 'navbar-link text-decoration '} to="/">
                                    <i className="fa fa-dashboard" aria-hidden="true"></i> Dashboard
                                </Link>
                            </li>
                            <li className='projects' >
                                <Link className={activeMenu === 'projects' ? 'text-decoration navbar-link active' : activeMenu === 'project' ? 'text-decoration navbar-link active' : 'text-decoration navbar-link'} to="/projects">
                                    <i className="fa fa-file-code-o" aria-hidden="true"></i> Projects
                                </Link>
                            </li>
                            <li className='people'>
                                <Link to="/members" className={activeMenu === 'members' ? 'navbar-link text-decoration active' : 'navbar-link text-decoration'}>
                                    <i className="fa fa-users" aria-hidden="true"></i>Members
                                </Link>
                            </li>
                            <li className='create_team' >
                                <Link to="/team" className={activeMenu === 'team' ? 'navbar-link text-decoration active' : 'navbar-link text-decoration'} >
                                    <i className="fa fa-users" aria-hidden="true"></i> Create Team
                                </Link>
                            </li>
                        </ul >
                    </div >
                    <ChangePassword />
                </div>
            )
        }
        return (
            <div>
                {sidebarDisplay}
            </div>
        );
    }
}
export default Sidebar;