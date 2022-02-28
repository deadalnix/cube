// @flow

/* eslint-disable no-undef */
enum Color {
    Primary,
    Blue,
    Green,
}
/* eslint-enable no-undef */

export default Color;

export const toBootstrapColor = (color: Color): string => {
    switch (color) {
        case Color.Primary:
            return "primary";
        case Color.Blue:
            return "info";
        case Color.Green:
            return "success";
    }
};
