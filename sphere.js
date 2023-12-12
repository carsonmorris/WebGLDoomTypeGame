
/** 
 * Returns the geometry, texture, normal, and indices buffer
 */
var square = (function (){
    let vertices;
    let nvertices;
    let textureCoords;
    let vertexIndices;
    let length;

    function init(){
        length = 100;
        vertices = [];
        nvertices = [];

        for (i = 0; i < length; i++){
            for (j = 0; j < length; j++){
                //Settings vertices
                vertices[0 + j*3 + i*length*3] = (j*1.0)/50.0 - 1.0;
                vertices[1 + j*3 + i*length*3] = 0.0;
                vertices[2 + j*3 + i*length*3] = (i*1.0)/50.0 - 1.0;

                //Settings normals
                nvertices[0 + j*3 + i*length*3] = 0.0;
                nvertices[1 + j*3 + i*length*3] = 1.0;
                nvertices[2 + j*3 + i*length*3] = 0.0;
            }
        }

        textureCoords = [];
        tc = 0;
        for ( i = 0; i < length; i++){
            for (j = 0; j < length; j++){
                textureCoords[tc++] = 0.0 + (j*1.0)/100.0;
                textureCoords[tc++] = 0.0 + (i*1.0)/100.0;
            }
        }

        vertexIndices = [];
        tvi = 0;
        //One less because we don't want make triangle outside of bounds
        for ( i = 0; i < length-1; i++){
            for (j = 0; j < length-1; j++){
                vertexIndices[tvi++] = 0.0+j+i*length;
                vertexIndices[tvi++] = 1.0+j+i*length;
                vertexIndices[tvi++] = 0.0+j+(i+1)*length;

                vertexIndices[tvi++] = 0.0+j+(i+1.0)*length;
                vertexIndices[tvi++] = 1.0+j+(i+1.0)*length; 
                vertexIndices[tvi++] = 1.0+j+i*length;
            }
        }
    }

    function getVertices(){
        return vertices;
    }

    function getNVertices(){
        return nvertices;
    }

    function getVertexIndices(){
        return vertexIndices;
    }

    function getTextureCoords(){
        return textureCoords;
    }

    function getLength(){
        return length;
    }

    return {
        init: init,
        getVertices: getVertices, 
        getNVertices: getNVertices,
        getVertexIndices: getVertexIndices,
        getTextureCoords: getTextureCoords, 
        getLength: getLength,
    }
});


/** 
 * Returns the geometry, texture, normal, and indices buffer
 */
var sphere = (function (){
    let vertices;
    let nvertices;
    let textureCoords;
    let vertexIndices;
    let length;
    let numVertices;
    let numTextureCoords;
    let numIndices;

    function init(tX, tY, tZ, radius){
        var radius = radius || 0.3;
        var slices = slices || 32; //Like longitude slices?
        var stacks = stacks || 16; //Like plate stacks
        var vertexCount = (slices+1)*(stacks+1);
        vertices = new Float32Array( 3*vertexCount ); //This is a typed array, more efficient
        nvertices = new Float32Array( 3* vertexCount );
        textureCoords = new Float32Array( 2*vertexCount );
        vertexIndices = new Uint16Array( 2*slices*stacks*3 );
        var du = 2*Math.PI/slices;
        var dv = Math.PI/stacks;
        var i,j,u,v,x,y,z;
        var indexV = 0;
        var indexT = 0;
        for (i = 0; i <= stacks; i++) {
            v = -Math.PI/2 + i*dv;
            for (j = 0; j <= slices; j++) {
                u = j*du;
                z = Math.cos(u)*Math.cos(v); //switched some stuff so earth is noraml XD
                x = Math.sin(u)*Math.cos(v);
                y = Math.sin(v);
                vertices[indexV] = radius*x + tX;
                nvertices[indexV++] = x;
                vertices[indexV] = radius*y + tY;
                nvertices[indexV++] = y;
                vertices[indexV] = radius*z + tZ;
                nvertices[indexV++] = z;
                textureCoords[indexT++] = j/slices;
                textureCoords[indexT++] = i/stacks;
            } 
        }
        var k = 0;
        for (j = 0; j < stacks; j++) {
            var row1 = j*(slices+1);
            var row2 = (j+1)*(slices+1);
            for (i = 0; i < slices; i++) {
                vertexIndices[k++] = row1 + i;
                vertexIndices[k++] = row2 + i + 1;
                vertexIndices[k++] = row2 + i;
                vertexIndices[k++] = row1 + i;
                vertexIndices[k++] = row1 + i + 1;
                vertexIndices[k++] = row2 + i + 1;
            }
        }

        numVertices = indexV;
        numTextureCoords = indexT;
        numIndices = k;
    }

    function getVertices(){
        return vertices;
    }

    function getNumVertices(){
        if(numVertices === null){
            console.log("Null value incoming")
        }
        return numVertices;
    }

    function getNumTextureCoords(){
        return numTextureCoords;
    }

    function getNumIndices(){
        return numIndices;
    }

    function getNVertices(){
        return nvertices;
    }

    function getVertexIndices(){
        return vertexIndices;
    }

    function getTextureCoords(){
        return textureCoords;
    }

    function getLength(){
        return length;
    }

    return {
        init: init,
        getVertices: getVertices, 
        getNVertices: getNVertices,
        getVertexIndices: getVertexIndices,
        getTextureCoords: getTextureCoords, 
        getLength: getLength,
        getNumVertices: getNumVertices,
        getNumTextureCoords: getNumTextureCoords,
        getNumIndices: getNumIndices,
    }
});