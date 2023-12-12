/**
 * Stack object to hold matrices. It acts like a saved "state", that can
 * be used to draw an object in reference to another object that is on
 * top of the stack. 
 */
var Stack = (function (){
    var matrices = [];
    var rear = 0;

    function push(matrix){
        matrices[rear] = mat4.create(matrix);
        rear++;
    }

    function pop(){
        if(rear === 0){
            throw ("Bad size");
        }

        var thing = mat4.create(matrices[rear-1]);
        rear--;

        return thing;
    }

    function peak(){
        if(rear === 0){
            throw("Bad Size");
        }

        return mat4.create(matrices[rear-1]);
    }

    return{
        pop: pop,
        push: push,
        peak: peak,
    }
})