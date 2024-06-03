import React from 'react'

const Header = () => {
    return (
        <>
            <nav className="navbar fixed-top bg-light shadow-sm">
                <div className="container">
                    <a className="navbar-brand" href="#">
                        <img src={require('../src/assets/images/adra-black.png')} alt="Bootstrap" className='100%'  />
                    </a>
                </div>
            </nav>

        </>
    )
}

export default Header
