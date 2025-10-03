
import styles from "./sidebar.module.css"
import Logo from "./Logo"
import AppNav from "./AppNav"
import { Outlet } from "react-router-dom"

export default function SideBar(){
    return(
        <div className={styles.sidebar}>
            <Logo />
            <AppNav /> 
            
            {/* <p> List of cities</p> */}
            <Outlet />

            <footer className={styles.footer}>
                <p className={styles.copyright}>&copy; Copyright {new Date().getFullYear} by FT_Worldwise Inc. </p>
            </footer>
        </div>
    )
}