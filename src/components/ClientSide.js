// @flow
import { type Node, useState, useLayoutEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import styles from "components/ClientSide.scss";

// This ensures that we only go through static rendering once at startup.
let clientSideLatch = false;

export const useClientSide = (): boolean => {
    const [isClient, setClient] = useState(clientSideLatch);

    useLayoutEffect(() => {
        if (!isClient && navigator.userAgent !== "ReactSnap") {
            setClient(true);
            clientSideLatch = true;
        }
    }, [isClient]);

    return isClient;
};

const ClientSide = ({ children }: { children: Node }): Node =>
    useClientSide() ? (
        children
    ) : (
        <FontAwesomeIcon className={styles.spinner} icon={faSpinner} spin />
    );

export default ClientSide;
