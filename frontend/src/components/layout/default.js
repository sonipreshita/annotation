import React, { Component } from 'react';
import Header from '../element/header.js';
import Sidebar from '../element/sidebar.js';
import Footer from '../element/footer.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class Default extends Component {
    render() {
        return (
            <div>
                <ToastContainer
                    position="top-right"
                    type="default"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                />
                <Header {...this.props} />
                <div className="wrapper new_page">
                    <Sidebar {...this.props} />
                    {this.props.children}
                </div>
                <Footer {...this.props} />
            </div>
        );
    }
}

export default Default;