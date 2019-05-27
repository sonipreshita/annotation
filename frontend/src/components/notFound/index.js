/*
* NotFound Component 404 
*/
import React, { Component } from 'react';
import { Link } from 'react-router';

class NotFound extends Component {
    render() {
        return (
            <div className="container">
                <center>
                    <h1>404</h1>
                    <h1>page not found</h1>
                    <p>We are sorry but the page you are looking for does not exist.</p>
                    <Link className="movie-list-item-username" to='/'>
                        Goto Home
                    </Link>
                </center>
            </div>
        );
    }
}
export default NotFound;