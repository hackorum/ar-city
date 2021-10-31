AFRAME.registerComponent("create-models", {
  init: async function () {
    let models = await this.getModels();
    let barcodes = Object.keys(models);
    barcodes.map((barcode) => {
      let model = models[barcode];
      this.createModel(model);
    });
  },
  getModels: async function () {
    return fetch("models.json")
      .then((res) => res.json())
      .then((data) => data);
  },
  createModel: function (model) {
    let barcodeValue = model.barcode_value;
    let modelUrl = model.model_url;
    let mname = model.model_name;
    let scene = document.querySelector("a-scene");
    let marker = document.createElement("a-marker");
    marker.setAttribute("id", `marker-${mname}`);
    marker.setAttribute("type", "barcode");
    marker.setAttribute("model_name", mname);
    marker.setAttribute("value", barcodeValue);
    marker.setAttribute("markerhandler", {});
    scene.appendChild(marker);
    if (barcodeValue === 0) {
      let modelEl = document.createElement("a-entity");
      modelEl.setAttribute("id", `${mname}`);
      modelEl.setAttribute("geometry", {
        primitive: "box",
        width: model.width,
        height: model.height,
      });
      modelEl.setAttribute("position", model.position);
      modelEl.setAttribute("rotation", model.rotation);
      modelEl.setAttribute("material", {
        color: model.color,
      });
      marker.appendChild(modelEl);
    } else {
      let modelEl = document.createElement("a-entity");
      modelEl.setAttribute("id", `${mname}`);
      modelEl.setAttribute("gltf-model", `url(${modelUrl})`);
      modelEl.setAttribute("scale", model.scale);
      modelEl.setAttribute("position", model.position);
      modelEl.setAttribute("rotation", model.rotation);
      marker.appendChild(modelEl);
    }
  },
});
