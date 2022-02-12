(function ($ /*, loaded*/) {
    /*
	if(!loaded){
		$.loadJS(['jquery.classbuilder', 'jquery.cookie']);
		return;
	}
	*/

    var colorList = {
        r: "8c000f",
        u: "ffd200",
        f: "003373",
        l: "ff4600",
        d: "f8f8f8",
        b: "00732f",
        h: "707070",
        j: "404040",
        k: "999999",
        g: "555555",
        v: "600d75",
    };

    $.each(colorList, function (i) {
        var id = "colorList." + i;
        var c = $.cookie(id);
        if (c) colorList[i] = c;
    });

    var displayLines = $.cookie("displayLines");
    if (displayLines == null) displayLines = "0";

    var defParams = {
        colorList: colorList,
        scriptType: "Solver",
        initScript: "",
        stickersRightList: ["r"],
        stickersUpList: ["u"],
        stickersFrontList: ["f"],
        stickersLeftList: ["l"],
        stickersDownList: ["d"],
        stickersBackList: ["b"],
        scriptProgress: 0,
        displayLines: displayLines,
        alpha: -25,
        beta: 45,
        showScrambleButton: false,
    };

    $.cubeAppletParams = function (params) {
        if (params) {
            $.extend(defParams, params);
        }

        return defParams;
    };

    $.cubeAppletRegister = function () {
        var opt = { expires: 99, path: "/" };
        $.cookie("displayLines", defParams.displayLines, opt);
        $.each(defParams.colorList, function (i, dc) {
            var id = "colorList." + i;
            $.cookie(id, dc, opt);
        });
    };

    $.cubeAppletRegister();

    $.fn.cubeApplet = function () {
        this.each(function () {
            var zone = $(this);

            var seq = zone.html().split("<!--");
            var paramstxt =
                seq.length > 1 ? $.trim(seq[1].split("-->")[0]) : "";
            seq = $.trim(seq[0]);

            var size = 3;
            if (zone.hasClass("pocket")) {
                size = 2;
            } else if (zone.hasClass("revenge")) {
                size = 4;
            } else if (zone.hasClass("professor")) {
                size = 5;
            } else if (zone.hasClass("cube6")) {
                size = 6;
            } else if (zone.hasClass("cube7")) {
                size = 7;
            }

            var params = {
                backgroundColor: zone.bgColor(),
            };
            $.extend(params, defParams);

            var sqsize = size * size;
            function fillStickers(s) {
                for (var i = 1; i < sqsize; i++) s[i] = s[0];
            }

            fillStickers(params.stickersFrontList);
            fillStickers(params.stickersLeftList);
            fillStickers(params.stickersDownList);
            fillStickers(params.stickersBackList);
            fillStickers(params.stickersRightList);
            fillStickers(params.stickersUpList);

            var m = paramstxt.match(/\<param\s+?.*?\>/g);
            if (m)
                $.each(m, function (k, m) {
                    m = m.match(/name="(.*?)"\s+value="(.*?)"/);
                    switch (m[1]) {
                        case "stickersFront":
                        case "stickersLeft":
                        case "stickersDown":
                        case "stickersBack":
                        case "stickersRight":
                        case "stickersUp":
                            m[1] = m[1] + "List";
                            m[2] = listStickers(m[2]);
                        case "stickersFrontList":
                        case "stickersLeftList":
                        case "stickersDownList":
                        case "stickersBackList":
                        case "stickersRightList":
                        case "stickersUpList":
                            var s = m[2].split(",");
                            $.each(s, function (k, v) {
                                s[k] = $.trim(v);
                            });
                            params[m[1]] = s;
                            break;
                        case "scriptType":
                            if (m[2] != "Generator") break;
                        case "initScript":
                            params[m[1]] = m[2];
                            break;
                    }
                });

            if ($.svgSupport()) {
                var cube = new Cube(size, params);

                var cs = compileSequence(
                    params.initScript,
                    new SupersetENG(size)
                );
                cs.execute(cube);

                if (params.scriptType == "Solver") {
                    cs = compileSequence(seq, new SupersetENG(size));
                    cs.inverse(cube);
                }

                var svg = cube.draw(zone.css("width"));

                zone.html(svg + seq);
            } else {
                /*
				zone.empty();
				
				svg = $.xmlDOM(svg).children();
				
				var s = document.createElementNS(svgns, 'svg'); // don't need to pass in 'true'
				s.setAttribute('width', svg.attr('width'));
				s.setAttribute('height', svg.attr('height'));
				s.setAttribute('viewBox', svg.attr('viewBox'));
				
				function copyTree(jt, st){
					jt.children().each(function(){
						var e = document.createElementNS(svgns, this.tagName);
						$.each(this.attributes, function(k, a){
							e.setAttribute(a.nodeName, a.nodeValue);
						});
						copyTree($(this), e);
						st.appendChild(e);
					});
				}
				
				copyTree(svg, s);
				
				// now append the SVG root to our document
				svgweb.appendChild(s, this); // note that we call svgweb.appendChild
				zone.append(seq);
				*/
            }

            //Put the parameters for ready for applet creation
            params.stickersFrontList = params.stickersFrontList.join(",");
            params.stickersLeftList = params.stickersLeftList.join(",");
            params.stickersDownList = params.stickersDownList.join(",");
            params.stickersBackList = params.stickersBackList.join(",");
            params.stickersRightList = params.stickersRightList.join(",");
            params.stickersUpList = params.stickersUpList.join(",");

            var cl = [];
            $.each(params.colorList, function (k, v) {
                cl.push(k + "=#" + v);
            });
            params.colorList = cl.join(",");

            if (!seq) seq = ".";
            params.script = seq;

            //Saves them in the zone
            zone.data("params", params);
            zone.attr("size", size);
            zone.addClass("toolTip");
            zone.attr(
                "title",
                "Astuce :: Cliquez pour faire apparaitre une animation 3D."
            );

            zone.click(function () {
                var zone = $(this);
                var params = "";
                $.each(zone.data("params"), function (k, v) {
                    params += '<param name="' + k + '" value="' + v + '" />';
                });

                var width = zone.width();
                var height = zone.height();
                var aname = appletName[size - 2];

                var txt =
                    '<applet code="' +
                    aname +
                    '" codebase="." archive="/applet/' +
                    aname +
                    '.jar" width="' +
                    width +
                    '" height="' +
                    height +
                    '">';
                txt +=
                    '<param name="resourceFile" value="/applet/' +
                    aname +
                    '.xml" />';
                txt += params;
                txt += "</applet>";

                zone.html(txt);
            });

            if (!$.svgSupport()) zone.click();
        });
    };

    var appletName = [
        "PocketPlayerFlat",
        "RubikPlayerFlat",
        "RevengePlayerFlat",
        "ProfessorPlayerFlat",
        "Cube6PlayerFlat",
        "Cube7PlayerFlat",
    ];

    function listStickers(s) {
        var rp = ["f", "l", "d", "b", "r", "u", "h", "j", "k"];
        $.each(rp, function (k, v) {
            s = s.split(k).join(v);
        });
        return s;
    }

    $.fn.bgColor = function () {
        var rgb = /rgba?\((\d+), (\d+), (\d+)(, \d+)?\)/;

        var c = this.css("backgroundColor");
        if (c.charAt(0) == "#") return c;

        var d = rgb.exec(c);
        if (d && d[4] != ", 0") {
            var r = parseInt(d[1]);
            var g = parseInt(d[2]);
            var b = parseInt(d[3]);

            rgb = b | (g << 8) | (r << 16);

            var hex = rgb.toString(16);

            //Pad with 0 !!
            while (hex.length < 6) hex = "0" + hex;

            return "#" + hex;
        }

        return this.parent().bgColor();
    };

    function compileSequence(seq, notation) {
        //Prepare sequence
        seq = seq.replace(/\s+/g, " ").replace(/\.+/g, ".");
        if (seq == "") seq = ".";

        var i = 0;

        return alg();

        /**
         * The Grammar
         *  {ALG0}    -> {SUBALG}{OP}{ALG}
         *  {ALG}     -> {SUBALG}{OP}{ALG} | EOF
         *  {SUBALG}  -> ({SUBSEQ0} | {TOKEN}
         *  {SUBSEQ0} -> {SUBALG}{OP}{SUBSEQ}
         *  {SUBSEQ}  -> ) | {SUBALG}{OP}{SUBSEQ}
         *  {TOKEN}   -> R|F|U|..... given by the notation file
         *  {OP}      -> {INT}{OP} | '{OP} | ε
         *
         */

        function alg() {
            var algs = [];

            do {
                algs.push(op(subalg()));
            } while (i < seq.length);

            return new SequenceAlg(algs);
        }

        function subalg() {
            if (seq[i] == "(") {
                i++;
                return subseq();
            } else {
                return token();
            }
        }

        function subseq() {
            var algs = [];

            do {
                algs.push(op(subalg()));
            } while (seq[i] != ")");

            // Skip )
            i++;

            return new SequenceAlg(algs);
        }

        function token() {
            var tested = seq.substring(i, seq.length);
            var token = null;

            $.each(notation.tokens, function (i, t) {
                if (tested.indexOf(t) == 0) {
                    token = t;
                    return false;
                }
            });

            if (!token) throw "Invalid token " + tested + " at " + i;

            i += token.length;
            return notation.algs[token];
        }

        function op(alg) {
            if (seq[i] == "'") {
                i++;
                return op(new InvAlg(alg));
            } else {
                var m = seq.substring(i, seq.length).match(/^(\d+)/);
                if (m) {
                    i += m[1].length;
                    return op(new RepeatAlg(alg, m[1]));
                } else {
                    //No operator
                    return alg;
                }
            }
        }
    }

    // Outil de bases Pour appliquer des séquences sur le cube
    //This alg does nothing
    var VoidAlg = $.buildClass({
        execute: function (cube) {},
        inverse: function (cube) {},
    });

    //This alg execute many algs one after another
    var SequenceAlg = $.buildClass({
        constructor: function (algs) {
            this.algs = algs;
        },
        execute: function (cube) {
            $.each(this.algs, function (i, a) {
                a.execute(cube);
            });
        },
        inverse: function (cube) {
            $.each(this.algs.slice().reverse(), function (i, a) {
                a.inverse(cube);
            });
        },
    });

    //This alg does a sequence backward
    var InvAlg = $.buildClass({
        constructor: function (alg) {
            this.alg = alg;
        },
        execute: function (cube) {
            this.alg.inverse(cube);
        },
        inverse: function (cube) {
            this.alg.execute(cube);
        },
    });

    //This alg repeast an alg multiple times
    var RepeatAlg = $.buildClass({
        constructor: function (alg, n) {
            this.alg = alg;
            this.n = n;
        },
        execute: function (cube) {
            for (var i = 0; i < this.n; i++) {
                this.alg.execute(cube);
            }
        },
        inverse: function (cube) {
            for (var i = 0; i < this.n; i++) {
                this.alg.inverse(cube);
            }
        },
    });

    //This alg allow use of setups move
    var SetupAlg = $.buildClass({
        constructor: function (alg, setup) {
            this.alg = alg;
            this.setup = setup;
        },
        execute: function (cube) {
            this.setup.execute(cube);
            this.alg.execute(cube);
            this.setup.inverse(cube);
        },
        inverse: function (cube) {
            this.setup.execute(cube);
            this.alg.inverse(cube);
            this.setup.inverse(cube);
        },
    });

    //Alg performed in both directions
    var DirAlg = $.buildClass({
        execute: function (cube) {
            this.perform(cube, 1);
        },
        inverse: function (cube) {
            this.perform(cube, 3);
        },
    });

    //Perform a Face move'+width+'
    var AlgFace = $.buildClass(
        {
            constructor: function (face) {
                this.face = face;
            },
            perform: function (cube, d) {
                cube.turnFace(this.face, d);
            },
        },
        DirAlg
    );

    //Perform a regrip move
    var AlgC = $.buildClass(
        {
            constructor: function (face) {
                this.face = face;
            },
            perform: function (cube, d) {
                cube.turnCube(this.face, d);
            },
        },
        DirAlg
    );

    //Perform a slice move
    var AlgM = $.buildClass(
        {
            constructor: function (face, layer) {
                this.face = face;
                this.layer = layer;
            },
            perform: function (cube, d) {
                if (this.layer == 0) {
                    cube.turnFace(this.face, d);
                } else {
                    cube.turnSlice(this.face, d, this.layer);
                }
            },
        },
        DirAlg
    );

    //Perform a multiSlice move
    var AlgT = $.buildClass(
        {
            constructor: function (face, layer) {
                this.algs = new Array();
                for (var i = 0; i < layer; i++) {
                    this.algs[i] = new AlgM(face, i);
                }
            },
        },
        SequenceAlg
    );

    // Notations
    var Notation = $.buildClass({
        constructor: function () {
            this.tokens = [".", " "];
            this.algs = {
                ".": new VoidAlg(),
                " ": new VoidAlg(),
            };

            // This isn't correct in $.each
            var t = this;
            $.each(this.faces, function (i, f) {
                t.addToken(f, new AlgFace(f));
                t.addToken("C" + f, new AlgC(f));
            });

            this.aliasToken("CR", "x");
            this.aliasToken("CU", "y");
            this.aliasToken("CF", "z");
        },

        faces: ["R", "U", "F", "L", "D", "B"],

        addToken: function (tk, alg) {
            if (!this.algs[tk]) {
                this.tokens.push(tk);
            }

            this.algs[tk] = alg;
        },

        removeToken: function (tk) {
            var i = this.tokens.indexOf(tk);

            if (i != -1) {
                this.tokens.splice(i, 1);
                delete this.algs[tk];
            }
        },

        aliasToken: function (tk1, tk2) {
            var i = this.tokens.indexOf(tk1);

            if (i != -1) {
                this.addToken(tk2, this.algs[tk1]);
            } else {
                throw "Cannot alias " + tk1;
            }
        },

        renameToken: function (tk1, tk2) {
            var i = this.tokens.indexOf(tk1);

            if (i != -1) {
                this.addToken(tk2, this.algs[tk1]);

                this.tokens.splice(i, 1);
                delete this.algs[tk1];
            } else {
                throw "Cannot rename " + tk1;
            }
        },
    });

    var SupersetENG = $.buildClass(
        {
            constructor: function (size) {
                this.uber.constructor();

                switch (size) {
                    case 3:
                        // This isn't correct in $.each
                        var t = this;
                        $.each(this.faces, function (i, f) {
                            t.addToken(f.toLowerCase(), new AlgT(f, 2));
                        });

                        this.addToken("M", new AlgM("L", 1));
                        this.addToken("S", new AlgM("F", 1));
                        this.addToken("E", new AlgM("D", 1));
                        this.addToken(
                            "m",
                            new SequenceAlg([new AlgM("R", 1), new AlgC("L")])
                        );
                        this.addToken(
                            "s",
                            new SequenceAlg([new AlgM("B", 1), new AlgC("F")])
                        );
                        this.addToken(
                            "e",
                            new SequenceAlg([new AlgM("U", 1), new AlgC("D")])
                        );
                        break;
                    case 5:
                    case 6:
                    case 7:
                        // This isn't correct in $.each
                        var t = this;
                        $.each(this.faces, function (i, f) {
                            for (
                                var i = 0;
                                i < Math.floor(size / 2 + 0.6);
                                i++
                            ) {
                                t.addToken("M" + i + f, new AlgM(f, i));
                            }
                            for (var i = 1; i < size; i++) {
                                t.addToken("T" + i + f, new AlgT(f, i));
                            }
                        });
                    case 4:
                        // This isn't correct in $.each
                        var t = this;
                        $.each(this.faces, function (i, f) {
                            t.addToken(
                                "T" + f,
                                new AlgT(f, Math.floor(size / 2))
                            );
                            t.addToken(
                                "M" + f,
                                new AlgM(f, Math.floor(size / 2 - 0.4))
                            );
                        });

                        break;
                }
            },
        },
        Notation
    );

    //The cube itself
    var Cube = $.buildClass({
        constructor: function (size, params) {
            this.notation = new SupersetENG(size);
            this.size = size;
            this.params = params;

            this.R = [];
            this.U = [];
            this.F = [];
            this.L = [];
            this.D = [];
            this.B = [];

            for (var i = 0; i < size; i++) {
                this.R[i] = [];
                this.U[i] = [];
                this.F[i] = [];
                this.L[i] = [];
                this.D[i] = [];
                this.B[i] = [];

                for (var j = 0; j < size; j++) {
                    this.R[i][j] = params.stickersRightList[i * size + j];
                    this.U[i][j] = params.stickersUpList[i * size + j];
                    this.F[i][j] = params.stickersFrontList[i * size + j];
                    this.L[i][j] = params.stickersLeftList[i * size + j];
                    this.D[i][j] = params.stickersDownList[i * size + j];
                    this.B[i][j] = params.stickersBackList[i * size + j];
                }
            }
        },

        axis: {
            R: { f: ["F", "U", "B", "D"], d: [3, 3, 1, 3] },
            U: { f: ["R", "F", "L", "B"], d: [0, 0, 0, 0] },
            F: { f: ["U", "R", "D", "L"], d: [2, 1, 0, 3] },
            L: { f: ["F", "D", "B", "U"], d: [1, 1, 3, 1] },
            D: { f: ["R", "B", "L", "F"], d: [2, 2, 2, 2] },
            B: { f: ["U", "L", "D", "R"], d: [0, 1, 2, 3] },
        },

        opposite: {
            R: "L",
            U: "D",
            F: "B",
            L: "R",
            D: "U",
            B: "F",
        },

        rotateCube: function (faces) {
            var tmp = this[faces[3]];

            for (var i = 3; i > 0; i--) {
                this[faces[i]] = this[faces[i - 1]];
            }

            this[faces[0]] = tmp;
        },

        turnCube: function (face, direction) {
            var faces = this.axis[face].f;

            switch (direction) {
                case 2:
                    this.rotateCube(faces);
                case 1:
                    this.rotateCube(faces);
                    break;
                case 3:
                    this.turnCube(this.opposite[face], 1);
                case 0:
                    return;
                default:
                    throw "Incorrect direction " + direction;
            }

            this.rotateFace(face, 1);
            this.rotateFace(this.opposite[face], 3);

            var d = this.axis[face].d;
            var prev = d[3];
            for (var i = 0; i < 4; i++) {
                var r = prev - d[i];
                if (r < 0) r += 4;
                this.rotateFace(faces[i], r);
                prev = d[i];
            }
        },

        getSlice: function (n, face, d) {
            if (d) n = this.size - n - 1;
            switch (d) {
                case 0:
                    return this[face][n].slice();
                case 1:
                    return this.getSlice(n, face, 3).reverse();
                case 2:
                    return this.getSlice(n, face, 0).reverse();
                case 3:
                    var ret = [];
                    for (var i = 0; i < this.size; i++) {
                        ret.push(this[face][i][n]);
                    }

                    return ret;
                default:
                    throw "Incorrect value of v : " + v;
            }
        },

        setSlice: function (n, face, d, values) {
            if (d) n = this.size - n - 1;
            switch (d) {
                case 0:
                    this[face][n] = values;
                    break;
                case 1:
                    this.setSlice(n, face, 3, values.reverse());
                    break;
                case 2:
                    this.setSlice(n, face, 0, values.reverse());
                    break;
                case 3:
                    for (var i = 0; i < this.size; i++) {
                        this[face][i][n] = values[i];
                    }

                    break;
                default:
                    throw "Incorrect value of v : " + v;
            }
        },

        rotateFace: function (face, direction) {
            if (!direction) return;

            var newface = [];

            for (var i = 0; i < this.size; i++) {
                newface[i] = this.getSlice(i, face, direction);
            }

            this[face] = newface;
        },

        rotateSlice: function (n, faces, directions) {
            var tmp = this.getSlice(n, faces[3], directions[3]);

            for (var i = 3; i > 0; i--) {
                this.setSlice(
                    n,
                    faces[i],
                    directions[i],
                    this.getSlice(n, faces[i - 1], directions[i - 1])
                );
            }

            this.setSlice(n, faces[i], directions[i], tmp);
        },

        turnFace: function (face, direction) {
            this.turnSlice(face, direction, 0);
            this.rotateFace(face, direction);
        },

        turnSlice: function (face, direction, index) {
            var faces = this.axis[face].f;
            var directions = this.axis[face].d;

            switch (direction) {
                case 2:
                    this.rotateSlice(index, faces, directions);
                case 1:
                    this.rotateSlice(index, faces, directions);
                    break;
                case 3:
                    this.rotateSlice(index, this.axis[this.opposite[face]].f, [
                        directions[0],
                        directions[3],
                        directions[2],
                        directions[1],
                    ]);
                    break;
                case 0:
                    return;
                default:
                    throw "Incorrect direction " + direction;
            }
        },

        draw: function (width) {
            var dim = this.size;

            // All cube face points
            var p = [];
            // Translation vector to centre the cube
            var t = [-dim / 2, -dim / 2, -dim / 2];
            // Translation vector to move the cube away from viewer
            var zpos = [0, 0, 5];
            // Rotation vectors to track visibility of each face
            var rv = [
                [1, 0, 0],
                [0, -1, 0],
                [0, 0, -1],
                [-1, 0, 0],
                [0, 1, 0],
                [0, 0, 1],
            ];

            //Init intersections
            for (var i = 0; i < 6; i++) {
                p[i] = [];
            }

            for (var i = 0; i <= dim; i++) {
                for (var j = 0; j < 6; j++) {
                    p[j][i] = [];
                }

                for (var j = 0; j <= dim; j++) {
                    p[0][i][j] = [dim, j, i];
                    p[1][i][j] = [i, 0, dim - j];
                    p[2][i][j] = [i, j, 0];
                    p[3][i][j] = [0, j, dim - i];
                    p[4][i][j] = [i, dim, j];
                    p[5][i][j] = [dim - i, j, dim];
                }
            }

            //Then project !
            for (var fc = 0; fc < 6; fc++) {
                for (var i = 0; i <= dim; i++) {
                    for (var j = 0; j <= dim; j++) {
                        // Now scale and tranform point to ensure size/pos independent of dim
                        p[fc][i][j] = translate(p[fc][i][j], t);
                        p[fc][i][j] = scale(p[fc][i][j], 1 / dim);
                        // Rotate cube as per perameter settings
                        p[fc][i][j] = rotate(p[fc][i][j], 1, this.params.beta);
                        p[fc][i][j] = rotate(p[fc][i][j], 0, this.params.alpha);

                        // Move cube away from viewer
                        p[fc][i][j] = translate(p[fc][i][j], zpos);
                        // Finally project the 3D points onto 2D
                        p[fc][i][j] = project(p[fc][i][j], zpos[2]);
                    }
                }
                // Rotate rotation vectors
                rv[fc] = rotate(rv[fc], 1, this.params.beta);
                rv[fc] = rotate(rv[fc], 0, this.params.alpha);
            }

            // Sort render order (crappy bubble sort)
            var ro = [0, 1, 2, 3, 4, 5];
            for (var i = 0; i < 5; i++) {
                for (var j = 0; j < 5; j++) {
                    if (rv[ro[j]][2] < rv[ro[j + 1]][2]) {
                        var t = ro[j];
                        ro[j] = ro[j + 1];
                        ro[j + 1] = t;
                    }
                }
            }

            function face_visible(f) {
                return rv[f][2] < -0.105;
            }

            // Returns svg for a cube outline
            function outline_svg(fc) {
                return (
                    '<polygon fill="#000000" stroke="#000000" points="' +
                    p[fc][0][0][0] * 0.94 +
                    "," +
                    p[fc][0][0][1] * 0.94 +
                    " " +
                    p[fc][dim][0][0] * 0.94 +
                    "," +
                    p[fc][dim][0][1] * 0.94 +
                    " " +
                    p[fc][dim][dim][0] * 0.94 +
                    "," +
                    p[fc][dim][dim][1] * 0.94 +
                    " " +
                    p[fc][0][dim][0] * 0.94 +
                    "," +
                    p[fc][0][dim][1] * 0.94 +
                    '" />'
                );
            }

            // Returns svg for a faces facelets
            function facelet_svg(fc) {
                var svg = "";
                for (var i = 0; i < dim; i++) {
                    for (var j = 0; j < dim; j++) {
                        // Find centre point of facelet
                        var cf = [
                            (p[fc][j][i][0] + p[fc][j + 1][i + 1][0]) / 2,
                            (p[fc][j][i][1] + p[fc][j + 1][i + 1][1]) / 2,
                            0,
                        ];
                        // Scale points in towards centre
                        var p1 = trans_scale(p[fc][j][i], cf, 0.85);
                        var p2 = trans_scale(p[fc][j + 1][i], cf, 0.85);
                        var p3 = trans_scale(p[fc][j + 1][i + 1], cf, 0.85);
                        var p4 = trans_scale(p[fc][j][i + 1], cf, 0.85);
                        // Generate facelet polygon
                        svg += gen_facelet(p1, p2, p3, p4, fc, i, j);
                    }
                }

                return svg;
            }

            var cube = this;
            /** Generates a polygon SVG tag for cube facelets */
            function gen_facelet(p1, p2, p3, p4, f, i, j) {
                var ftp = cube[cube.notation.faces[f].toUpperCase()][i][j];
                var fcol = cube.params.colorList[ftp];
                return (
                    '<polygon fill="#' +
                    fcol +
                    '" stroke="#000000" class="facelet' +
                    ftp +
                    '" points="' +
                    p1[0] +
                    "," +
                    p1[1] +
                    " " +
                    p2[0] +
                    "," +
                    p2[1] +
                    " " +
                    p3[0] +
                    "," +
                    p3[1] +
                    " " +
                    p4[0] +
                    "," +
                    p4[1] +
                    '" />'
                );
            }

            var txt =
                '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-0.9 -0.9 1.8 1.8" style="width: ' +
                width +
                "; height: " +
                width +
                ';">';

            // Create outline for each visible face
            txt += '<g stroke-width="0.1" stroke-linejoin="round">';
            for (var ri = 3; ri < 6; ri++) {
                if (face_visible(ro[ri])) txt += outline_svg(ro[ri]);
            }
            txt += "</g>";

            // Create polygon for each visible facelet
            txt += '<g stroke-width="0" stroke-linejoin="round">';
            for (var ri = 3; ri < 6; ri++) {
                if (face_visible(ro[ri])) txt += facelet_svg(ro[ri]);
            }
            txt += "</g>";

            txt += "</svg>";

            return txt;
        },
    });

    var cos = Math.cos;
    var sin = Math.sin;

    //3D manipulation functions
    function rotate(p, ax, an) {
        an = (Math.PI * an) / 180;

        var np = [p[0], p[1], p[2]];
        switch (ax) {
            case 0:
                np[2] = p[2] * cos(an) - p[1] * sin(an);
                np[1] = p[2] * sin(an) + p[1] * cos(an);
                break;
            case 1:
                np[0] = p[0] * cos(an) + p[2] * sin(an);
                np[2] = -p[0] * sin(an) + p[2] * cos(an);
                break;
            case 2:
                np[0] = p[0] * cos(an) - p[1] * sin(an);
                np[1] = p[0] * sin(an) + p[1] * cos(an);
                break;
        }

        return np;
    }

    function translate(p, t) {
        return [p[0] + t[0], p[1] + t[1], p[2] + t[2]];
    }

    function scale(p, f) {
        return [p[0] * f, p[1] * f, p[2] * f];
    }

    function project(p, d) {
        return [(p[0] * d) / p[2], (p[1] * d) / p[2], p[2]];
    }

    // Scale point relative to position vector
    function trans_scale(p, v, f) {
        // Translate each facelet to cf
        var iv = [-v[0], -v[1], -v[2]];
        return translate(scale(translate(p, iv), f), v);
    }
})(jQuery);
