const svgNS = "http://www.w3.org/2000/svg";
/**
 * @description Not currently used.
 * There are top level nodes which contain metadata,
 * I'm not sure how many there are, but at least I've seen:
 * memo, originalAuthorName, title
 */
const getMetadataValue = (oripa, metadataKey) => {
	const parentNode = Array.from(oripa.children)
		.filter(el => el.attributes.length && Array.from(el.attributes)
			.filter(attr => attr.nodeValue === metadataKey)
			.shift() !== undefined)
		.shift();
	const node = parentNode
		? Array.from(parentNode.children).shift()
		: null;
	return node
		? node.textContent
		: undefined;
};
/**
 * @description Get all line elements from the ORIPA file.
 */
const getLines = (oripa) => {
	const linesParent = Array.from(oripa.children)
		.filter(el => el.attributes.length && Array.from(el.attributes)
			.filter(attr => attr.nodeValue === "lines")
			.shift() !== undefined)
		.shift();
	const linesNode = linesParent
		? Array.from(linesParent.children)
			.filter(el => el.className === "oripa.OriLineProxy")
			.shift()
		: undefined;
	return linesNode ? Array.from(linesNode.children) : [];
};

const nullXMLValue = { children: [{ textContent: "0" }]};
/**
 * @description For each ORIPA line, extract the coordinates
 * and the assignment type. Return each line as a simple
 * Javascript object. XML Entries will be missing if
 * their value is 0, this is taken care of. Coordinates
 * will be parsed into floats, but not the assignments.
 * @param {object[]} lines the result of calling getLines()
 */
const parseLines = (lines) => lines.map(line => {
	const attributes = Array.from(line.children[0].children);
	const assignment = (attributes
		.filter(el => el.attributes[0].nodeValue === "type")
		.shift() || nullXMLValue)
		.children[0]
		.textContent;
	const x0 = (attributes
		.filter(el => el.attributes[0].nodeValue === "x0")
		.shift() || nullXMLValue)
		.children[0]
		.textContent;
	const x1 = (attributes
		.filter(el => el.attributes[0].nodeValue === "x1")
		.shift() || nullXMLValue)
		.children[0]
		.textContent;
	const y0 = (attributes
		.filter(el => el.attributes[0].nodeValue === "y0")
		.shift() || nullXMLValue)
		.children[0]
		.textContent;
	const y1 = (attributes
		.filter(el => el.attributes[0].nodeValue === "y1")
		.shift() || nullXMLValue)
		.children[0]
		.textContent;
	return {
		assignment,
		x0: parseFloat(x0),
		x1: parseFloat(x1),
		y0: parseFloat(y0),
		y1: parseFloat(y1),
	};
});
/**
 * @description Get the bounding box enclosing all line segments.
 * @param {object[]} lines result of getLines() and parseLines()
 */
const getBoundingBox = (lines) => {
	let min = [Infinity, Infinity];
	let max = [-Infinity, -Infinity];
	lines.forEach(line => {
		min[0] = Math.min(min[0], line.x0, line.x1);
		min[1] = Math.min(min[1], line.y0, line.y1);
		max[0] = Math.max(max[0], line.x0, line.x1);
		max[1] = Math.max(max[1], line.y0, line.y1);
	});
	return [min, max];
};
/**
 * @description ORIPA line assignments are numbered.
 * I'm not sure how many types of lines there are,
 * or which one (2,3) is mountain and valley.
 */
const assignmentColor = {
	0: "gray",               // not sure what this is
	1: "rgb(84, 84, 84)",    // boundary
	2: "rgb(186, 64, 36)",   // unsure which is M and V
	3: "rgb(54, 100, 151)",  // unsure which is M and V
	4: "lightgray",          // not sure if used
	5: "purple",             // not sure if used
};

const drawLine = (svg, line) => {
	const l = document.createElementNS(svgNS, "line");
	l.setAttribute("x1", line.x0);
	l.setAttribute("x2", line.x1);
	l.setAttribute("y1", line.y0);
	l.setAttribute("y2", line.y1);
	l.setAttribute("stroke", assignmentColor[line.assignment]);
	svg.appendChild(l);
};

const makeSVG = (lines) => {
	const svg = document.createElementNS(svgNS, "svg");
	lines.forEach(line => drawLine(svg, line));
	const bounds = getBoundingBox(lines);
	const span = [
		bounds[1][0] - bounds[0][0],
		bounds[1][1] - bounds[0][1],
	];
	svg.setAttribute("viewBox", `${bounds[0][0]} ${bounds[0][1]} ${span[0]} ${span[1]}`);
	svg.setAttribute("stroke-width", Math.min(...span) / 200);
	return svg;
};
/**
 * @description Convert an ORIPA file (string) into an SVG (string).
 * @param {string} oripa an oripa file as a string
 * @returns {string} an SVG rendering of the ORIPA file
 */
const opxToSVG = (string) => {
	try {
		const parsed = new DOMParser().parseFromString(string, "text/xml");
		const oripa = Array.from(parsed.documentElement.children)
			.filter(el => Array.from(el.classList).includes("oripa.DataSet"))
			.shift();
		const lines = parseLines(getLines(oripa));
		const svg = makeSVG(lines);
		return new XMLSerializer().serializeToString(svg);
	} catch (error) {
		console.error("ORIPA bad file format", error);
	}
};

export default opxToSVG;
