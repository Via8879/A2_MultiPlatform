AFRAME.registerComponent("cursor-grab", {
    init:function() {
        let el = this.el;
        let grabbedObject = null;
        let scene = document.querySelector("a-scene");

        window.addEventListener("mousemove", function (evt) {
            if (grabbedObject) {
                let camera = this.document.querySelector("#camera");
                let worldPos = camera.object3D.localToWorld(new THREE.Vector3(0, 0, -1));
                grabbedObject.setAttribute("position", worldPos);
            }
        });

        el.addEventListener("click", function (evt) {
            let intersectedObject = evt.detail.intersectedEl;

            if (intersectedObject && intersectedObject.classList.contains("grabbable")) {

                if (!grabbedObject) {

                    grabbedObject = intersectedObject;
                    grabbedObject.removeAttribute("dynamic-body");
                }
                else {
                    grabbedObject.setAttribute("dynamic-body", "mass: 1");
                    DropObj(grabbedObject);
                    grabbedObject = null;
    
                }
            }

        });

        function DropObj(obj){
            let objPos = obj.getAttribute("position");

            let trashCan = document.querySelector("#trash");
            let trashPos = trashCan.getAttribute("position");

            if (distance(objPos, trashPos) < 1.5) {
                obj.parentNode.removeChild(obj);
                return;
            }

            let basket = document.querySelector("#basket");
            let basketPos = basket.getAttribute("position");

            if (distance(objPos, basketPos) < 1.5) {
                obj.setAttribute("position", basketPos);
                obj.setAttribute("scale", "0.1 0.1 0.1");
                return;
            }

            let bunny = document.querySelector("#bunny");
            let bunnyPos = bunny.getAttribute("position");

            if (distance(objPos, bunnyPos) < 1.5){
                obj.parentNode.removeChild(obj);
                return;
            }
        }

        function distance(pos1, pos2) {
            return Math.sqrt(
                Math.pow(pos1.x - pos2.x, 2) +
                Math.pow(pos1.y - pos2.y, 2) +
                Math.pow(pos1.z - pos2.z, 2)
            );
        }
    }
});