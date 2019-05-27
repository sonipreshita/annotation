import React, { Component } from 'react';
import Login from '../profile/login.js'
import Register from '../profile/register.js'

class Footer extends Component {

  render() {
    return (
      <div>
        <div className="footer">
          <p>© 2018 Multidots Solutions Pvt. Ltd.</p><img src="/img/md_logo1.png" alt="MD Logo" />
        </div>
        <Login />
        <Register />
      </div>

    );
  }
}
export default Footer;