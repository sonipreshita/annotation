import React from 'react';
import { Link } from 'react-router';

export function topMenuBar(activeMenu, projectId) {
    return (
        <ul className="navigation">
            <li className="list-item screens">
                <Link to={`/project/${projectId}/screens`} className={activeMenu === 'screens' ? 'link active-screen-menu' : 'link'}>Screens</Link>
            </li>
            <li className="list-item workflow" >
                <Link to={`/project/${projectId}/workflow`} className={activeMenu === 'workflow' ? 'link active-screen-menu' : 'link'}>Workflow</Link>
            </li>
            <li className="list-item activity" >
                <Link to={`/project/${projectId}/activity`} className={activeMenu === 'activity' ? 'link active-screen-menu' : 'link'}>Activity</Link>
            </li>
            <li className="list-item comments" >
                <Link to={`/project/${projectId}/comments`} className={activeMenu === 'comments' ? 'link active-screen-menu' : 'link'}>Comments</Link>
            </li>
        </ul>
    )
}


export function Spinner() {
    return (
        <div className="spinner-container">
            <div className="spinner">
                <div className="rect1"></div>
                <div className="rect2"></div>
                <div className="rect3"></div>
                <div className="rect4"></div>
                <div className="rect5"></div>
            </div>
        </div>
    )
}


// export function Spinner() {
//     return (
//         <div className="loading-directive" >
//             <div className="loader">
//                 <svg className="circular">
//                     <circle className="path" cx={35} cy={32} r={30} fill="none" stroke-width={4}></circle>
//                 </svg>
//                 <svg className="circular">
//                     <circle className="path" cx={35} cy={32} r={30} fill={'none'} stroke-width={4} stroke="orange"/>
//                 </svg>
//             </div>
//         </div>
//     )
// }


export function noRecordFound(message) {
    return (
        <div className="spinner-container">
            <div style={{ textAlign: 'center' }}>
                <h3>{message ? message : `No record found.`}</h3>
            </div>
        </div>
    )
}