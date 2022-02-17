import { makeNotation, extendNotation } from "./AlgNotation.js";

test("makeNotation", () => {
    expect(
        makeNotation({
            g: null,
            gg: null,
        })
    ).toEqual({
        g: {
            "": null,
            "g": null,
        },
    });

    expect(
        makeNotation({
            g: "",
            gg: "",
        })
    ).toEqual({
        g: {
            "": "",
            "g": "",
        },
    });
});

test("extendsNotation", () => {
    const N1 = makeNotation({
        g: "",
    });

    const N2 = extendNotation(N1, {
        g: null,
        gg: null,
    });

    expect(N2).toEqual({
        g: {
            "": null,
            "g": null,
        },
    });

    const N3 = extendNotation(N2, {
        gg: "gg",
    });

    expect(N1).toEqual({ g: "" });
    expect(N2).toEqual({ g: { "": null, "g": null } });
    expect(N3).toEqual({ g: { "": null, "g": "gg" } });
});
