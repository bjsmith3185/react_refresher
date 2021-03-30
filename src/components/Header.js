import React from 'react'
import { useLocation } from "react-router-dom"
import Button from './Button'

const Header = ({ title, onAdd, showAddTask }) => {

    const location = useLocation();

    return (
        <header className='header'>
            <h1>{title}r</h1>
            { location.pathname === ('/') &&  <Button  
                color={ showAddTask ? "red" : "green"} 
                text={ showAddTask ? "close" : "add"}
                onClick={onAdd}/>}
        </header>
    )
}

Header.defaultProps = {
    title: 'Task Tracker'
}

export default Header
