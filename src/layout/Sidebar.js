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
    text: Node,
    img: string,
    opened: boolean,
    close: () => void,
};

const Sidebar = ({
    color,
    routes,
    text,
    img,
    opened,
    close,
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
                        to=""
                        className={cx(styles.simpletext, styles.logomini)}
                        onClick={close}
                    >
                        <img src={img} alt="react-logo" />
                    </Link>
                    <Link
                        to=""
                        className={cx(styles.simpletext, styles.logonormal)}
                        onClick={close}
                    >
                        {text}
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
