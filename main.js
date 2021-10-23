import WebMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";
import Expand from "@arcgis/core/widgets/Expand";
import Editor from "@arcgis/core/widgets/Editor";
import SnappingControls from "@arcgis/core/widgets/support/SnappingControls";

import "./style.css";

let pointLayer, lineLayer, polygonLayer;

// Create a map from the referenced webmap item id
const webmap = new WebMap({
  portalItem: {
    id: "459a495fc16d4d4caa35e92e895694c8",
  },
});

const view = new MapView({
  container: "viewDiv",
  map: webmap,
});

view.when(() => {
  view.map.loadAll().then(() => {
    view.map.allLayers.forEach((layer) => {
      if (layer.type === "feature") {
        switch (layer.geometryType) {
          case "polygon":
            polygonLayer = layer;
            break;
          case "polyline":
            lineLayer = layer;
            break;
          case "point":
            pointLayer = layer;
            break;
        }
      }
    });

    // Create layerInfos for layers in Editor. This
    // sets the fields for editing.

    const pointInfos = {
      layer: pointLayer,
      fieldConfig: [
        {
          name: "HazardType",
          label: "Hazard type",
        },
        {
          name: "Description",
          label: "Description",
        },
        {
          name: "SpecialInstructions",
          label: "Special Instructions",
        },
        {
          name: "Status",
          label: "Status",
        },
        {
          name: "Priority",
          label: "Priority",
        },
      ],
    };

    const lineInfos = {
      layer: lineLayer,
      fieldConfig: [
        {
          name: "Severity",
          label: "Severity",
        },
        {
          name: "blocktype",
          label: "Type of blockage",
        },
        {
          name: "fullclose",
          label: "Full closure",
        },
        {
          name: "active",
          label: "Active",
        },
        {
          name: "locdesc",
          label: "Location Description",
        },
      ],
    };

    const polyInfos = {
      layer: polygonLayer,
      fieldConfig: [
        {
          name: "incidenttype",
          label: "Incident Type",
        },
        {
          name: "activeincid",
          label: "Active",
        },
        {
          name: "descrip",
          label: "Description",
        },
      ],
    };

    const editor = new Editor({
      view: view,
      layerInfos: [
        {
          layer: pointLayer,
          fieldConfig: [pointInfos],
        },
        {
          layer: lineLayer,
          fieldConfig: [lineInfos],
        },
        {
          layer: polygonLayer,
          fieldConfig: [polyInfos],
        },
      ],
      // It is possible to set snapping via the API by directly setting SnappingOptions in the Editor. This can also be toggled on/off using the CTRL key. By default snapping is not enabled, setting enabled to true toggles this.
      snappingOptions: {
        // Autocastable to snapping options
        enabled: true, // sets the global snapping option that controls both geometry constraints (self-snapping) and feature snapping.
        featureSources: [
          {
            // Autocastable to FeatureSnappingLayerSource
            // Enable feature snapping on specified layer(s)
            layer: pointLayer,
          },
        ],
      },
    });

    // Add the SnappingControls widget to provide a UI for easy toggling of Editor snapping. Associate the SnappingControls widget to the Editor's snappingOptions as seen below. If nothing is set within the Editor, the defaults will display and all layers associated with the map that support snapping display within the snapping layers as disabled.

    const snappingControls = new SnappingControls({
      label: "Configure snapping options",
      view: view,
      snappingOptions: editor.snappingOptions, // Autocastable to SnappingOptions
    });

    // Create the Expand widget and set its content to that of the SnappingControls
    const snappingExpand = new Expand({
      expandIconClass: "esri-icon-settings2",
      expandTooltip: "Show snapping UI",
      expanded: false,
      view: view,
      content: snappingControls,
    });

    // Add the widgets to top and bottom right of the view
    view.ui.add(editor, "top-right");
    view.ui.add(snappingExpand, "bottom-right");
  });
});
