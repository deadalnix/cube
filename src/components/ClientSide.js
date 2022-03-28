// @flow
import { type Node, useState, useLayoutEffect } from "react";

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
        <i className="tim-icons icon-refresh-02 tim-icons-is-spinning" />
    );

export default ClientSide;
