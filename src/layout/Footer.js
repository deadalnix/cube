// @flow
import { type Node } from "react";

import styles from "layout/Footer.scss";

import { Icon } from "@iconify/react";
import heartFilled from "@iconify/icons-ant-design/heart-filled";

const Footer = (): Node => (
    <footer className={styles.footer}>
        <nav className={styles.navbar}>
            <a href="about">About</a>
            <a href="https://github.com/deadalnix/cube">Source Code</a>
        </nav>
        <div className={styles.copyright}>
            © {new Date().getFullYear()} made with{" "}
            <Icon icon={heartFilled} inline={true} /> by{" "}
            <a
                href="https://github.com/deadalnix/cube"
                target="_blank"
                rel="noreferrer"
            >
                deadalnix
            </a>
            .
        </div>
    </footer>
);

export default Footer;
