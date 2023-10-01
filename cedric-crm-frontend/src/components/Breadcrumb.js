// 
import React from 'react';
import { Link } from 'react-router-dom';

function Breadcrumb({ crumbs }) {
    return ( <
        div className = "bg-gray-100 p-4 mb-4" > {
            crumbs.map((crumb, index) => ( <
                span key = { index } > { index !== 0 && ' > ' } <
                Link to = { crumb.path }
                className = "text-blue-500 hover:underline" > { crumb.label } <
                /Link> <
                /span>
            ))
        } <
        /div>
    );
}

export default Breadcrumb;