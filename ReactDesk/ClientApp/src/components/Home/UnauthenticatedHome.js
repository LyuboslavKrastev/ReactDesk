import React from 'react'
import { Link } from 'react-router-dom'
 
const UnauthenticatedHome = (props) => {
    return (
        <div>
            <div class="jumbotron text-center">
                <h1>ReactDesk</h1>
                <h2>Helpdesk Management System</h2>
                <hr class="bg-dark" />
                <p><Link  to="/Login">Login </Link> if you have an account.</p>
                <p><Link  to="/Register">Register </Link> if you don't.</p>
            </div>
      </div>
    )
}

export default UnauthenticatedHome