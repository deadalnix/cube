// @flow
import { type Node } from "react";
import { Nav } from "reactstrap";
import { NavLink, Link, useLocation } from "react-router-dom";

import type Color from "layout/Color";

import { type Route } from "routes";

import cx from "classnames";
import styles from "layout/Sidebar.scss";

type SidebarProps = {
    color: Color,
    routes: Array<Route>,
    opened: boolean,
    close: () => void,
    logo: {
        link: string,
        text: Node,
        imgSrc: string,
    },
};

const Sidebar = ({
    color,
    routes,
    opened,
    close,
    logo,
}: SidebarProps): Node => {
    const location = useLocation();

    // verifies if routeName is the one active (in browser input)
    const isActivePath = path => {
        return location.pathname === "/" + path;
    };

    return (
        <div
            className={cx(styles.sidebar, {
                [styles.navopen]: opened,
            })}
            data={color}
        >
            <div className={styles.wrapper}>
                <div className={styles.logo}>
                    <Link
                        to={logo.link}
                        className={cx(styles.simpletext, styles.logomini)}
                        onClick={close}
                    >
                        <img src={logo.imgSrc} alt="react-logo" />
                    </Link>
                    <Link
                        to={logo.link}
                        className={cx(styles.simpletext, styles.logonormal)}
                        onClick={close}
                    >
                        {logo.text}
                    </Link>
                </div>
                <Nav>
                    {routes.map((prop, key) => (
                        <li
                            className={cx({
                                [styles.active]: isActivePath(prop.path),
                            })}
                            key={key}
                        >
                            <NavLink
                                to={prop.path}
                                className={({ isActive }) =>
                                    cx("nav-link", { active: isActive })
                                }
                                onClick={close}
                            >
                                <i className={prop.icon} />
                                <p>{prop.name}</p>
                            </NavLink>
                        </li>
                    ))}
                </Nav>
            </div>
        </div>
    );
};

export default Sidebar;
