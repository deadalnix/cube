// @flow
import { type Node, useState, useLayoutEffect } from "react";

import { Icon } from "@iconify/react";
import loadingOutlined from "@iconify/icons-ant-design/loading-outlined";

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
        <div className={styles.spinner}>
            <Icon icon={loadingOutlined} />
        </div>
    );

export default ClientSide;
