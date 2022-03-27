// @flow
import { type Node, useState, useLayoutEffect } from "react";

export const useClientSide = (): boolean => {
    const [isClient, setClient] = useState(false);

    useLayoutEffect(() => {
        if (navigator.userAgent !== "ReactSnap") {
            setClient(true);
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
