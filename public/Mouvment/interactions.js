AFRAME.registerComponent("cursor-grab", {
    init:function() {
        let el = this.el;
        let grabbedObject = null;
        let scene = document.querySelector("a-scene");

        let trashCan = document.querySelector("#trash");
        let basket = document.querySelector("#basket");
        let bunny = document.querySelector("#bunny");


        if (!trashCan || !basket || !bunny) {
            console.error("Missing objects(buny, trashCan and basket. Check index.html");
            return;
        }

        let messageBox = document.createElement("a-text");
        messageBox.setAttribute("value", "");
        messageBox.setAttribute("position", "0 2 -3");
        messageBox.setAttribute("color", "black");
        messageBox.setAttribute("align", "center");
        messageBox.setAttribute("scale", "2 2 2");
        scene.appendChild(messageBox);

        function showMessage(msg) {
            messageBox.setAttribute("value", msg);
            setTimeout(() => {
                messageBox.setAttribute("value", "");
            }, 2000);
        }
        

        function updatedObjectPosition() {
            if (grabbedObject){
                let camera = document.querySelector("#camera");
                let worldPos = new THREE.Vector3(0, 0, -1);
                camera.object3D.localToWorld(worldPos);
                grabbedObject.setAttribute("position", worldPos);
                requestAnimationFrame(updatedObjectPosition);
            }
        }
     

        el.addEventListener("click", function (evt) {
            let intersectedObject = evt.detail.intersectedEl;

            if (intersectedObject && intersectedObject.classList.contains("grabbable")) {
                if (!grabbedObject) {

                    grabbedObject = intersectedObject;
                    grabbedObject.removeAttribute("dynamic-body");
                    grabbedObject.setAttribute("scale", "0.2 0.2 0.2");
                    updatedObjectPosition();
                }
                else {
                    grabbedObject.setAttribute("dynamic-body", "mass: 1");
                    checkDrop(grabbedObject);
                    grabbedObject = null;
    
                }
            }

        });

        function checkDrop(obj){
            let objPos = AFRAME.utils.coordinate.pars(obj.getAttribute("position"));

            let trashPos = AFRAME.utils.coordinate.pars(trashCan.getAttribute("position"));
            let basketPos = AFRAME.utils.coordinate.pars(basket.getAttribute("position"));
            let bunnyPos = AFRAME.utils.coordinate.pars(bunny.getAttribute("position"));

            if (distance(objPos, trashPos) < 1.5) {
                showMessage("Vegetable was put in the trash");
                obj.parentNode.removeChild(obj);
                return;
            }

            if (distance(objPos, basketPos) < 1.5) {
                showMessage("Vegetable was put in the basket");
                obj.parentNode.removeChild(obj);
                return;
            }

            if (distance(objPos, bunnyPos) < 1.5) {
                showMessage("You have feed the bunny!!");
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