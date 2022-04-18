// @flow
import { type Node } from "react";

import styles from "layout/Footer.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

const Footer = (): Node => (
    <footer className={styles.footer}>
        <nav className={styles.navbar}>
            <a href="about">About</a>
            <a href="https://github.com/deadalnix/cube">Source Code</a>
        </nav>
        <div className={styles.copyright}>
            © {new Date().getFullYear()} made with{" "}
            <FontAwesomeIcon icon={faHeart} /> by{" "}
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
