// @flow
import { type Node, useState } from "react";
import { useLocation } from "react-router-dom";

import cx from "classnames";
import styles from "layout/Layout.scss";

import Sidebar from "layout/Sidebar";
import Navbar from "layout/Navbar";
import Footer from "layout/Footer";
import { ThemeProvider } from "layout/Theme";
import Color from "layout/Color";

import routes from "routes.js";

import logo from "assets/img/react-logo.png";

type LayoutProps = {
    children: Node,
};

const Layout = ({ children }: LayoutProps): Node => {
    const location = useLocation();

    const [sidebarOpened, setsidebarOpened] = useState(false);

    // eslint-disable-next-line no-unused-vars
    const [color, setColor] = useState(Color.Blue);

    const toggleSidebar = () => {
        setsidebarOpened(!sidebarOpened);
    };

    const title = (() => {
        for (const r of routes) {
            if (location.pathname === "/" + r.path) {
                return r.name;
            }
        }

        return "Twisty Space";
    })();

    return (
        <ThemeProvider>
            <div
                className={cx(styles.wrapper, {
                    [styles.navopen]: sidebarOpened,
                })}
            >
                <Sidebar
                    color={color}
                    routes={routes}
                    logo={{
                        link: "https://deadalnix.github.io/cube/",
                        text: "Twisty Space",
                        imgSrc: logo,
                    }}
                    opened={sidebarOpened}
                    close={() => setsidebarOpened(false)}
                />
                <div className={styles.panel} data={color}>
                    <Navbar
                        brandText={title}
                        toggleSidebar={toggleSidebar}
                        sidebarOpened={sidebarOpened}
                    />
                    <div className={styles.content}>{children}</div>
                    <Footer />
                </div>
            </div>
        </ThemeProvider>
    );
};

export default Layout;
