import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class Simple extends React.Component{
    render() {
        return(
            <div>
                <ToastContainer
                    position="top-right"
                    type="default"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                />
                {this.props.children}
            </div>
        );
    }
}
export default Simple;