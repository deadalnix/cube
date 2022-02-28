// @flow
import { type Node, useState, useEffect } from "react";

import {
    Button,
    Collapse,
    Input,
    InputGroup,
    NavbarBrand,
    Navbar,
    Nav,
    Container,
    Modal,
    NavbarToggler,
    ModalHeader,
} from "reactstrap";

import cx from "classnames";
import styles from "layout/Navbar.scss";

type NavbarProps = {
    brandText: string,
    toggleSidebar: () => void,
    sidebarOpened: boolean,
};

const XNavbar = ({
    brandText,
    toggleSidebar,
    sidebarOpened,
}: NavbarProps): Node => {
    const [collapseOpen, setcollapseOpen] = useState(false);
    const [modalSearch, setmodalSearch] = useState(false);
    const [color, setcolor] = useState(styles.transparent);

    // function that adds color white/transparent to the navbar on resize (this is for the collapse)
    const updateColor = () => {
        if (window.innerWidth < 993 && collapseOpen) {
            setcolor("bg-white");
        } else {
            setcolor(styles.transparent);
        }
    };

    useEffect(() => {
        window.addEventListener("resize", updateColor);
        // Specify how to clean up after this effect:
        return () => window.removeEventListener("resize", updateColor);
    });

    // this function opens and closes the collapse on small devices
    const toggleCollapse = () => {
        if (collapseOpen) {
            setcolor(styles.transparent);
        } else {
            setcolor("bg-white");
        }
        setcollapseOpen(!collapseOpen);
    };

    // this function is to open the Search modal
    const toggleModalSearch = () => {
        setmodalSearch(!modalSearch);
    };

    return (
        <>
            <Navbar className={cx(styles.absolute, color)} expand="lg">
                <Container fluid>
                    <div className={styles.wrapper}>
                        <div
                            className={cx(styles.toggle, "d-inline", {
                                toggled: sidebarOpened,
                                [styles.toggled]: sidebarOpened,
                            })}
                        >
                            <NavbarToggler onClick={toggleSidebar}>
                                <span
                                    className={cx(
                                        styles.togglerBar,
                                        styles.bar1
                                    )}
                                />
                                <span
                                    className={cx(
                                        styles.togglerBar,
                                        styles.bar2
                                    )}
                                />
                                <span
                                    className={cx(
                                        styles.togglerBar,
                                        styles.bar3
                                    )}
                                />
                            </NavbarToggler>
                        </div>
                        <NavbarBrand
                            href="#pablo"
                            onClick={e => e.preventDefault()}
                        >
                            {brandText}
                        </NavbarBrand>
                    </div>
                    <NavbarToggler onClick={toggleCollapse}>
                        <span className={cx(styles.togglerBar, styles.kebab)} />
                        <span className={cx(styles.togglerBar, styles.kebab)} />
                        <span className={cx(styles.togglerBar, styles.kebab)} />
                    </NavbarToggler>
                    <Collapse navbar isOpen={collapseOpen}>
                        <Nav className="ml-auto" navbar>
                            <InputGroup
                                className={cx("search-bar", styles.searchBar)}
                            >
                                <Button
                                    color="link"
                                    onClick={toggleModalSearch}
                                >
                                    <i className="tim-icons icon-zoom-split" />
                                    <span className="d-lg-none d-md-block">
                                        Search
                                    </span>
                                </Button>
                            </InputGroup>
                            <li className="d-lg-none" />
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
            <Modal
                modalClassName={styles.modalSearch}
                isOpen={modalSearch}
                toggle={toggleModalSearch}
            >
                <ModalHeader>
                    <Input placeholder="SEARCH" type="text" />
                    <button
                        aria-label="Close"
                        className="close"
                        onClick={toggleModalSearch}
                    >
                        <i className="tim-icons icon-simple-remove" />
                    </button>
                </ModalHeader>
            </Modal>
        </>
    );
};

export default XNavbar;
