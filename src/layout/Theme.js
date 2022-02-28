// @flow
import {
    type Node,
    type Context,
    useState,
    useEffect,
    createContext,
} from "react";

/* eslint-disable no-undef */
export enum Mode {
    Dark,
    Light,
}
/* eslint-enable no-undef */

export type Theme = {|
    mode: Mode,
    changeMode: Mode => void,
|};

const ThemeContext: Context<Theme> = createContext<Theme>({
    mode: Mode.Dark,
    changeMode: () => {},
});

export default ThemeContext;

type ThemeProviderProps = {
    children: Node,
};

export const ThemeProvider = ({ children }: ThemeProviderProps): Node => {
    const [mode, setMode] = useState(Mode.Dark);

    const changeMode = (mode: Mode) => setMode(mode);

    useEffect(() => {
        switch (mode) {
            case Mode.Light:
                document.body?.classList?.add("white-content");
                break;
            case Mode.Dark:
                document.body?.classList?.remove("white-content");
                break;
        }
    }, [mode]);

    return (
        <ThemeContext.Provider
            value={{
                mode: mode,
                changeMode: changeMode,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};
