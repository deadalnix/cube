// @flow
import { type Node, useState } from "react";
import { useLocation, matchPath, NavLink, Link } from "react-router-dom";

import routes from "routes.js";

import Footer from "layout/Footer";

import logo from "assets/img/react-logo.png";

import { Icon } from "@iconify/react";
import menuKebab from "@iconify/icons-charm/menu-kebab";

import cx from "classnames";
import styles from "layout/Layout.scss";

type LayoutProps = {
    children: Node,
};

const Layout = ({ children }: LayoutProps): Node => {
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    const title = (() => {
        for (const r of routes) {
            if (matchPath(r.path, location.pathname)) {
                return r.name;
            }
        }

        return "Twisty Space";
    })();

    return (
        <div
            className={cx(styles.wrapper, {
                [styles.sidebarOpen]: sidebarOpen,
            })}
        >
            <div className={styles.sidebar}>
                <Link to="" className={styles.brand}>
                    <img src={logo} alt="react-logo" />
                    Twisty Space
                </Link>
                <nav className={styles.sidebarNav}>
                    {routes.map((prop, key) => (
                        <NavLink
                            key={key}
                            to={prop.path}
                            onClick={closeSidebar}
                            className={({ isActive }) =>
                                cx(styles.navLink, {
                                    [styles.active]: isActive,
                                })
                            }
                        >
                            <Icon className={styles.navIcon} icon={prop.icon} />
                            {prop.name}
                        </NavLink>
                    ))}
                </nav>
            </div>
            <div className={styles.panel}>
                <div className={styles.navbar}>
                    <nav className={styles.breadcrumb}>
                        <button
                            className={styles.sidebarToggle}
                            onClick={toggleSidebar}
                        >
                            <span className={styles.bar1} />
                            <span className={styles.bar2} />
                            <span className={styles.bar3} />
                        </button>
                        <h1>{title}</h1>
                    </nav>
                    <button className={styles.menuToggle}>
                        <Icon icon={menuKebab} />
                    </button>
                </div>
                <div className={styles.content}>{children}</div>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;
