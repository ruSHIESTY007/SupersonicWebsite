
/**
 * This function aims to validate whether a provided set of vertices are a convex polygon and thereby valid for analysis.
 * 
 * @param {Array} vertices A set of vertices describing the airfoil
 * @returns {boolean} Boolean of whether polygon is convex of not.
 */
function isConvex(vertices) {
    if (vertices.length < 3) {
        console.log("This is not a valid polygon");
        return false;
    }

    let sign = 0;
    
    for (let i = 0; i < vertices.length; i++) {
        // Create and save points
        let p1 = vertices[i];
        let p2 = vertices[(i + 1) % vertices.length];
        let p3 = vertices[(i + 2) % vertices.length];

        // Create vectors
        let vec1x = p2.x - p1.x;
        let vec1y = p2.y - p1.y;
        let vec2x = p3.x - p2.x;
        let vec2y = p3.y - p2.y;

        // Calculate cross product
        let crossProduct = vec1x * vec2y - (vec1y * vec2x);

        // Perform logic
        if (crossProduct !== 0) {
            let currentSign = crossProduct > 0 ? 1: -1;

            if (currentSign === 0) {
                // First time we get to nonzero we set the sign
                sign = currentSign;
            } else if (currentSign !== sign) {
                return false;
            }
        }
    }
}

/**
 * This function aims to convert an array of line objects into an array of vertex object for better processing.
 * 
 * @param {Array} lines An array of lines describing supersonic airfoil
 * @returns {Array} An array of vertices to perform further analysis
 */
function linesToVertices(lines) {
    if (lines.length === 0) return [];

    let vertices = [];

    for (let line of lines) {
        vertices.push({x:  line.x1, y: line.y1});
    }
    
    return vertices;
}


/**
 * This  function aims to check whether the polygon is even closed
 * 
 * @param {Array} lines A set of line objects describing the polygon candidate
 * @returns {boolean} Verdict of whether airfoil is of a closed polygon or not
 */
function isShapeClosed(lines) {
    if (lines.length < 3) return false;
    return lines[0].x1 === lines[lines.length - 1].x2 && lines[0].y1 === lines[lines.length - 1].y2;
}