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
            }, 4000);
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

                    if (!grabbedObject.hasAttribute("data-original-scale")) {

                        let originalScale = grabbedObject.getAttribute("scale");
                        grabbedObject.setAttribute("data-original-scale", originalScale);
                    }
                    grabbedObject.removeAttribute("dynamic-body");
                    updatedObjectPosition();
                }
                
            }

        });

        function handleDrop(target, message) {
            target.addEventListener("click", function (evt) {
                if (grabbedObject) {
                    let targetEntity = evt.target;
                    console.log("dropped on:", targetEntity.id);
                    showMessage(message);
                    grabbedObject.parentNode.removeChild(grabbedObject);
                    grabbedObject = null;
                }
            });
        }

        handleDrop(trashCan, "Vegetable has been put in the trash");
        handleDrop(basket, "Vegetable has been put in the basket");
        handleDrop(bunny, "You fed the bunny!!");

       
    }
});
