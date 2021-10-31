let mlist = [];
let models = null;
AFRAME.registerComponent("markerhandler", {
  init: async function () {
    this.el.addEventListener("markerFound", () => {
      let mname = this.el.getAttribute("model_name");
      let barcodeValue = this.el.getAttribute("value");
      mlist.push({
        model_name: mname,
        barcode_value: barcodeValue,
      });
      this.el.setAttribute("visible", true);
    });
    this.el.addEventListener("markerLost", () => {
      let modelName = this.el.getAttribute("model_name");
      let index = mlist.findIndex((x) => x.model_name === modelName);
      if (index > -1) {
        mlist.splice(index, 1);
      }
    });
  },
  getDistance: function (elA, elB) {
    return elA.object3D.position.distanceTo(elB.object3D.position);
  },
  modelInArray: function (arr, val) {
    for (let i of arr) {
      if (i.model_name === val) {
        return true;
      }
    }
    return false;
  },
  tick: async function () {
    if (mlist.length > 1) {
      let isBaseModelPresent = this.modelInArray(mlist, "base");
      let messageText = document.querySelector("#message-text");
      if (!isBaseModelPresent) {
        messageText.setAttribute("visible", true);
      } else {
        if (models === null) {
          models = await this.getModels();
        }
        messageText.setAttribute("visible", false);
        this.placeModel("road", models);
        this.placeModel("car", models);
        this.placeModel("building1", models);
        this.placeModel("building2", models);
        this.placeModel("building3", models);
        this.placeModel("tree", models);
        this.placeModel("sun", models);
      }
    }
  },
  getModels: async function () {
    return fetch("models.json")
      .then((res) => res.json())
      .then((data) => data);
  },
  getModelGeometry: function (models, mname) {
    let barcodes = Object.keys(models);
    for (let barcode of barcodes) {
      if (models[barcode].model_name === mname) {
        return {
          position: models[barcode]["placement_position"],
          rotation: models[barcode]["placement_rotation"],
          scale: models[barcode]["placement_scale"],
          model_url: models[barcode]["model_url"],
        };
      }
    }
  },
  placeModel: function (modelName, models) {
    let isListContainModel = this.modelInArray(mlist, modelName);
    if (isListContainModel) {
      let distance = null;
      let marker1 = document.querySelector(`#marker-base`);
      let marker2 = document.querySelector(`#marker-${modelName}`);
      distance = this.getDistance(marker1, marker2);
      if (distance < 1.25) {
        let modelEl = document.querySelector(`#${modelName}`);
        modelEl.setAttribute("visible", false);
        let isModelPlaced = document.querySelector(`#model-${modelName}`);
        if (isModelPlaced === null) {
          let element = document.createElement("a-entity");
          let mgeo = this.getModelGeometry(models, modelName);
          element.setAttribute("id", `model-${modelName}`);
          element.setAttribute("gltf-model", `url(${mgeo.model_url})`);
          element.setAttribute("position", mgeo.position);
          element.setAttribute("rotation", mgeo.rotation);
          element.setAttribute("scale", mgeo.scale);
          marker1.appendChild(element);
        }
      }
    }
  },
});
