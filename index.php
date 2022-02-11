<!doctype html>
<html>
<head>
	<meta charset="utf-8">
	<title>Deadalnix's algorithm set</title>
	<style type="text/css">
	.algcase {
		float: left;
		display: table;
		width: 400px;
		height: 150px;
	}
	.algcase p {
		display: table-cell;
		vertical-align: middle;
		width: 100%;
		height: 100%;
	}
	.algcase img {
		float: left;
	}
	span.mainalg {
		font-weight: bold;
		font-size: 1.3em;
	}
	h2, h3 {
		clear: left;
	}
	</style>
</head>
<body>
<h1>Deadalnix's algorithm set</h1>
<p>This is a list of all the algorithm I use. I plan to update it as I learn new ones.</p>
<?php

class URL {
	private $base = '';
	private $params = array();

	public function __construct($base, $params = array()) {
		// FIXME: Base should have some sanity checks in place, maybe.
		$this->base = $base;
		$this->params = $params;
	}

	public function __toString() {
		$url = $this->base;
		if (!$this->params) {
			return $url;
		}

		return $url.'?'.http_build_query($this->params);
	}
}

class HtmlElement {
	const TAG = 'html';
	
	private $params = array();
	private $inner = array();
	
	public function __construct($params = array(), $inners = array()) {
		// FIXME: validate tag name.
		$this->params = $params;
		$this->inners = $inners;
	}

	public function __toString() {
		$str = '<'.static::TAG;

		foreach ($this->params as $name => $value) {
			$str .= ' '.htmlentities($name).'="'.htmlentities($value).'"';
		}

		if (!$this->inners) {
			return $str.' />';
		}

		$str .= '>';
		foreach ($this->inners as $inner) {
			if (!$inner instanceof HtmlElement) {
				$inner = htmlentities($inner);
			}

			$str .= $inner;
		}

		return $str.'</'.static::TAG.'>';
	}
}

class Img extends HtmlElement {
	const TAG = 'img';

	public function __construct(Url $src) {
		parent::__construct(array('src' => $src));
	}
}

class Div extends HtmlElement {
	const TAG = 'div';
}

class P extends HtmlElement {
	const TAG = 'p';
}

class Span extends HtmlElement {
	const TAG = 'span';
}

class Br extends HtmlElement {
	const TAG = 'br';
}

class AlgCase {
	const STAGE = 'll';
	const VIEW = '';
	const CARDINALITY = 0;

	private $name = '';
	private $alg = '';
	private $note = '';
	private $alts = array();

	const VISUALCUBE_URL = '/visualcube/visualcube.php';

	public function __construct($name, $alg, $proba = 0, $note = '', $alts = array()) {
		$this->name = $name;
		$this->alg = $alg;
		$this->proba = $proba;
		$this->note = $note;
		$this->alts = $alts;
	}

	public function __toString() {
		$img = new Img(new Url(
			self::VISUALCUBE_URL,
			array(
				'fmt' => 'svg',
				'size' => 150,
				'case' => $this->alg,
				'stage' => static::STAGE,
				'view' => static::VIEW,
			)
		));

		$content = array();
		$content[] = new Span(
			array('class' => 'algorithm mainalg'),
			array($this->alg)
		);

		if ($this->note) {
			$content[] = new Br();
			$content[] = $this->note;
		}

		$content[] = new Br();
		foreach ($this->alts as $alt) {
			$content[] = new Br();
			$content[] = $alt;
		}

		$content[] = new Br();
		$content[] = $this->name;
		if (static::CARDINALITY != 0 && $this->proba != 0) {
			if ($this->name) {
				$content[] = ' - ';
			}

			$content[] = 'probability: 1/'.(static::CARDINALITY / $this->proba);
		}

		$div = new Div(
			array('class' => 'algcase'),
			array(
				$img,
				new P(array(), $content),
			)
		);

		return (string)$div;
	}
}

class F2l extends AlgCase {
	const STAGE = 'f2l';

	public function __construct($alg, $alts = array()) {
		parent::__construct('', $alg, 0, '', $alts);
	}
}

class Oll extends AlgCase {
	const STAGE = 'oll';
	const VIEW = 'plan';
	const CARDINALITY = 216;
}

class Pll extends AlgCase {
	const STAGE = 'll';
	const VIEW = 'plan';
	const CARDINALITY = 72;
}

class F2lFr extends F2l {
	const STAGE = "f2l_1";
}

class F2lFl extends F2l {
	const STAGE = "f2l_1-y";
}

class F2lBr extends F2l {
	const STAGE = "f2l_1-y'";
}

function render_set($sets) {
	foreach ($sets as $name => $set) {
		echo '<h3>'.$name.'</h3>';
		foreach ($set as $case) {
			echo $case."\n";
		}
	}
}

echo '<h2>F2L</h2>';
echo "<p>This list all the F2L cases when the edge is properly oriented. Most of these case are to be understood rarher than learned. Usually, what is done is simply to pair the edge and the corner so they can be inserted in 3 moves and then do so. Understanding these will allow to adapt them in order to use more advanced techniques such as partial edge control later on. If pieces are in other slots, move them on the U layer and use the solutions below. Most of the alternatives presented make looking ahead harder, so I avoid using them before the last slot.</p>";

render_set(array(
	'Basics inserts' => array(
		new F2l("U R U' R'"),
		new F2l("U' R' U R"),
		new F2l("R U R'"),
		new F2l("R' U' R"),
	),
	'Corner right' => array(
		new F2l("R U' R' U R U' R' U2 R U' R'"),
		new F2l("R' U R U' R' U R U2 R' U R"),
		new F2l("U2 R U' R' U' R U R'", array("U' R U R' U R U R'")),
		new F2l("U2 R' U R U R' U' R", array("U R' U' R U' R' U' R")),
		new F2l("U' R U' R' U R U R'"),
		new F2l("U R' U R U' R' U' R"),
	),
	'Corner front' => array(
		new F2l("R U R' U2 R U' R' U R U' R'", array("R r' U r U' r' U' M'")),
		new F2l("R' U' R U2 R' U R U' R' U R", array("M' U' r' U r U r' R")),
		new F2l("U' R U2 R' U2 R U' R'"),
		new F2l("U R' U2 R U2 R' U R"),
		new F2l("U' R U R' U2 R U' R'"),
		new F2l("U R' U' R U2 R' U R"),
	),
	'Corner up' => array(
		new F2l("U R U' R' U' R U' R' U R U' R'", array("U2 R2 U2 R' U' R U' R2")),
		new F2l("U' R' U R U R' U R U' R' U R", array("U2 R2 U2 R U R' U R2")),
		new F2l("U2 R U R' U R U' R'"),
		new F2l("U2 R' U' R U' R' U R"),
		new F2l("U R U2 R' U R U' R'"),
		new F2l("U' R' U2 R U' R' U R"),
		new F2l("R U2 R' U' R U R'"),
		new F2l("R' U2 R U R' U' R"),
	),
	'Slotted corner' => array(
		new F2l("F' R U R' U' R' F R", array("R' F' R U R U' R' F")),
		new F2l("F R2 U R U' R2 F'"),
		new F2l("R U R' U' R U R'"),
		new F2l("R' U' R U R' U' R"),
		new F2l("R U' R' U R U' R'"),
		new F2l("R' U R U' R' U R"),
	),
	'Slotted edge' => array(
		new F2l("U R U R' U2 R U R'"),
		new F2l("U' R' U' R U2 R' U' R"),
		new F2l("U2 R' F R F' U2 R U R'", array("U' R U M' U' R' U R U r'")),
		new F2l("U R' U' R r' U R U' R' U' r"),
		new F2l("U' R U' R' U2 R U' R'"),
		new F2l("U R' U R U2 R' U R"),
		new F2l("U2 R U R' U' y' R' U R y", array("U M' U R U' r' R U' R'")),
		new F2l("U R' F R' F' R U' R"),
		new F2l("U R U' R' U R U' R' U R U' R'"),
		new F2l("U' R' U R U' R' U R U' R' U R"),
		new F2l("U' R' F R F' R U' R'"),
		new F2l("R' U R' F R F' R"),
	),
	'Slotted corner and edge' => array(
		new F2l("R U' R' U R U2 R' U R U' R'"),
		new F2l("R' U R U' R' U2 R U' R' U R"),
		new F2l("R U' M' U' r' U2 r U r'"),
		new F2l("R' U R r' U r U2 r' U' r"),
		new F2l("R U' R' U' R U R' U2 R U' R'"),
		new F2l("R' U R U R' U' R U2 R' U R"),
		new F2l("r U' r' U2 r U r' R U R'"),
		new F2l("r' U r U2 r' U' M' U' R"),
		new F2l("R U' R' d R' U2 R U2 R' U R y", array("R2 U2 F R2 F' U2 R' U R")),
		new F2l("R' U R F R U R2 U' R F'"),
	),
));

echo '<h2>PLL</h2>';
echo "<p>Diagonal cases are the worst, so it is worth trying to avoid them. this can be done by using alternative OLL when the corner permutation is defavorable.</p>";

render_set(array(
	'EPLL' => array(
		new Pll('Ua', "M2' U M U2 M' U M2'", 4, "", array(
			"M2' U M' U2 M U M2'",
			"R U' R U R U R U' R' U' R2",
			"R2 U' R' U' R U R U R U' R",
		)),
		new Pll('Ub', "M2' U' M U2 M' U' M2'", 4, "", array(
			"M2' U' M' U2 M U' M2'",
			"R2 U R U R' U' R' U' R' U R'",
			"R' U R' U' R' U' R' U R U R2",
		)),
		new Pll('H', "M2' U M2' U2 M2' U M2'", 1),
		new Pll('Z', "M U M2' U M2' U M U2 M2' U'", 2),
	),
	'CPLL' => array(
		new Pll('Aa', "l R D2 R' U' R D2 R' U l'", 4, "", array(
			"l' U R' D2 R U' R' D2 R2 R l",
		)),
		new Pll('Ab', "l R U2 R D R' U2 R D' R x", 4, "", array(
			"l U' R D2 R' U R D2 R' l'",
			"L r u2 R' U' r u2 r' F L'",
		)),
		new Pll('E', "l U' R' D R U R' D' R U R' D R U' R' D' x", 2),
	),
	'G perms' => array(
		new Pll('Ga', "R2 U R' U R' U' R U' R2 U' D R' U R D'", 4),
		new Pll('Gb', "R' U' R U D' R2 U R' U R U' R U' R2 D", 4),
		new Pll('Gc', "R2 U' R U' R U R' U R2 U D' R U' R' D", 4),
		new Pll('Gd', "R U R' U' D R2 U' R U' R' U R' U R2 D'", 4),
	),
	'Adjacent' => array(
		new Pll('Ra', "R U' R' U' R U R D R' U' R D' R' U2 R'", 4),
		new Pll('Rb', "R2 F R U R U' R' F' R U2 R' U2 R", 4),
		new Pll('Ja', "l' R' F R F' R U2 r' U r U2 x'", 4),
		new Pll('Jb', "R U R' F' R U R' U' R' F R2 U' R'", 4),
		new Pll('T', "R U R' U' R' F R2 U' R' U' R U R' F'", 4),
		new Pll('F', "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R", 4, "", array(
			"R' U2 R' d' R' F' R2 U' R' U R' F R U' F",
		)),
	),
	'Diagonal' => array(
		new Pll('V', "R' U R' d' R' F' R2 U' R' U R' F R F", 4),
		new Pll('Y', "F R U' R' U' R U R' F' R U R' U' R' F R F'", 4),
		new Pll('Na', "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'", 1, '', array(
			"z U R' D R2 U' R U D' R' D R2 U' R D' z'"
		)),
		new Pll('Nb', "z U' R D' R2 U R' U' D R D' R2 U R' D z'", 1),
	),

));

echo '<h2>OLL</h2>';
echo "<p>Because the Dot cases are the worse, we'll try to avoid them by doign partial edge control during F2L or using different variations to insert the last pair.</p>";

render_set(array(
	'All edges oriented' => array(
		new Oll('Sune', "R' U2 R U R' U R", 4),
		new Oll('Anti Sune', "R U2 R' U' R U' R'", 4),
		new Oll('H', "R U2 R' U' R U R' U' R U' R'", 2),
		new Oll('Pi', "R U2 R2 U' R2 U' R2 U2 R", 4),
		new Oll('T', "R U R D R' U' R D' R2'", 4),
		new Oll('L', "R2' D' R U' R' D R U R", 4),
		new Oll('U', "R2' D' R U2 R' D R U2' R", 4),
	),
	'T Shapes' => array(
		new Oll('T6', "F R U R' U' F'", 4),
		new Oll('T9', "R U R' U' R' F R F'", 4),
	),
	'Square shapess' => array(
		new Oll('', "r U2 R' U' R U' r'", 4),
		new Oll('', "r' U2 R U R' U r", 4),
	),
	'C shapes' => array(
		new Oll('', "R U R2 U' R' F R U R U' F'", 4, "Do F' with the right ring finger."),
		new Oll('', "R' U' R' F R F' U R", 4),
	),
	'W shapes' => array(
		new Oll('', "R U R' U R U' R' U' R' F R F'", 4),
		new Oll('', "R' U' R U' R' U R U l U' R' U x", 4),
	),
	'Edge flips' => array(
		new Oll('', "r U R' U' M U R U' R'", 4),
		new Oll('', "R U R' U' M' U R U' r'", 2),
	),
	'P shapes' => array(
		new Oll('', "R' U' F U R U' R' F' R", 4),
		new Oll('', "R U B' U' R' U R B R'", 4, "Do the first U by pushing with your left index finger and B' by pushing with your right index finger."),
		new Oll('', "R' U' F' U F R", 4),
		new Oll('', "F U R U' R' F'", 4),
	),
	'I shapes' => array(
		new Oll('', "F U R U' R' U R U' R' F'", 4),
		new Oll('', "r' U' r U' R' U R U' R' U R r' U r", 2),
		new Oll('', "R' U' R U' R' d R' U R B", 4, "You can do the final B using your right index finger."),
		new Oll('', "r U2 R' U' R2 r' U R' U' r U' r'", 2),
	),
	'Fish shapes' => array(
		new Oll('', "R U R' U' R' F R2 U R' U' F'", 4),
		new Oll('', "R U R' U R' F R F' R U2 R'", 4),
		new Oll('', "R U2 R2 F R F' R U2 R'", 4),
		new Oll('', "F R U' R' U' R U R' F'", 4),
	),
	'Knight shapes' => array(
		new Oll('', "r U' r' U' r U r' y' R' U R", 4),
		new Oll('', "R' F R U R' F' R F U' F'", 4),
		new Oll('', "r U r' R U R' U' r U' r'", 4),
		new Oll('', "r' U' M' U' R U r' U r", 4),
	),
	'Awkward shapes' => array(
		new Oll('', "r2 D' r U r' D r2 U' r' U' r", 4),
		new Oll('', "r' D' r U' r' D r2 U' r' U r U r'", 4),
		new Oll('', "R U R' U R U2 R' F R U R' U' F'", 4),
		new Oll('', "l' U R U' R' U R U' l U R' U' R U R'", 4),
	),
	'L shapes' => array(
		new Oll('', "F R U R' U' R U R' U' F'", 4),
		new Oll('', "F R' F' R U2 R U' R' U R U2 R'", 4),
		new Oll('', "r U' r2 U r2 U r2 U' r", 4),
		new Oll('', "r' U r2 U' r2 U' r2 U r'", 4),
		new Oll('', "r' U' R U' R' U R U' R' U2 r", 4),
		new Oll('', "r U R' U R U' R' U R U2 r'", 4),
	),
	'Lightning shapes' => array(
		new Oll('', "r U R' U R U2 r'", 4),
		new Oll('', "r' U' R U' R' U2 r", 4),
		new Oll('', "R2 r' U R' U R U2 R' U M'", 4),
		new Oll('', "R' M' U' R U' R' U2 R U' M", 4),
		new Oll('', "R B' R' U' R U B U' R'", 4, "Do the B' by pushing with your left index finger and the B with your right inde finger."),
		new Oll('', "r U R' U R U' R' U R U2 r'", 4),
	),
	'Dot shapes' => array(
		new Oll('', "R U2 R2 F R F' U2 R' F R F'", 2),
		new Oll('', "r U r' U2 R U2 R' U2 r U' r'", 4),
		new Oll('', "f R U R' U' f' U' F R U R' U' F'", 4),
		new Oll('', "f R U R' U' f' U F R U R' U' F'", 4),
		new Oll('', "R U2 R2 F R F' U2 M' U R U' r'", 4),
		new Oll('', "M U R U R' U' M' R' F R F'", 4),
		new Oll('', "R U R' U R' F R F' U2 R' F R F'", 4),
		new Oll('', "M U R U R' U' M2 U R U' r'", 1),
	),
));

echo '<h2>Advanced F2L</h2>';
echo '<p>This is not one but several sets to improve F2L. For the most part, cases are easily deduced, but for effisciency, systematisation is helpful. The sets presented are about how to use empty slots to simplify bad cases, how to handle misloted pieces and a list of all cases where the edge is misoriented.</p>';

render_set(array(
	'Empty slot on R' => array(
		new F2lBr("R' U2 R2 U R'"),
		new F2lFr("R U2 R2 U' R"),
		new F2lBr("U' R' U R U' R U R'"),
		new F2lFr("U R U' R' U R' U' R"),
		new F2lBr("R2 U' R' U R2"),
		new F2lFr("R2 U R U' R2"),
		new F2lBr("U2 D R' U R D'"),
		new F2lFr("U2 D' R U' R' D"),
		new F2lBr("U' D R' U' R D'"),
		new F2lFr("U D' R U R' D"),
		new F2lBr("D' R' F R F' R U' R' U D"),
		new F2lFr("D R' U R' F R F' R D'"),
	),
	'Empty slot on F' => array(
		new F2lFl("F r U r' F'"),
		new F2lFl("D R' F R F' R U' R' U D'"),
	),
	'Basic insert, misoriented' => array(
		new F2l("y' U' R' U R y"),
		new F2l("r' U' R U M'"),
		new F2l("F' U' F"),
		new F2l("f R f'"),
	),
	'Corner right, misoriented' => array(
		new F2l("d R' U' R U2 R' U R y", array("U' r U' R' U R U r'")),
		new F2l("d R' U2 R U2 R' U R y", array("r' U2 R2 U R2 U r")),
		new F2l("R U' R' U d R' U' R y", array("U M' U R U' r' U' R U R'")),
	),
	'Corner front, misoriented' => array(
		new F2l("d R' U R U' R' U' R y", array("M' U' R U R' U' R U2 r'")),
		new F2l("U' R U' R' d R' U' R y", array("U r U R' U' R2 r' U' R'")),
		new F2l("U' R U2' R' d R' U' R y", array("U' R U2 R' U2 R2 r' U' R' U M'")),
	),
	'Corner up, misoriented' => array(
		new F2l("y' R' U2 R U R' U' R y"),
		new F2l("U' R U' R2' F R F' R U' R'"),
		new F2l("r U' r' U2 r U r'"),
		new F2l("U' R U R2' F R F' R U' R'"), // R' F R' F' R2 U' R' U R from the back
	),
));

?>
</body>
