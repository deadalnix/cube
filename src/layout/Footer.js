// @flow
import { type Node } from "react";
import { Container, Nav, NavItem, NavLink } from "reactstrap";

import styles from "layout/Footer.scss";

const Footer = (): Node => (
    <footer className={styles.footer}>
        <Container fluid>
            <Nav>
                <NavItem>
                    <NavLink href="about">About</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink href="https://github.com/deadalnix/cube">
                        Source Code
                    </NavLink>
                </NavItem>
            </Nav>
            <div className={styles.copyright}>
                © {new Date().getFullYear()} made with{" "}
                <i className="tim-icons icon-heart-2" /> by{" "}
                <a
                    href="https://github.com/deadalnix/cube"
                    target="_blank"
                    rel="noreferrer"
                >
                    deadalnix
                </a>
                .
            </div>
        </Container>
    </footer>
);

export default Footer;
