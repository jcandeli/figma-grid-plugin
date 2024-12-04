figma.showUI(__html__);

figma.ui.resize(350, 335);

// Add these globals at the top with the other one
let selectedElement: SceneNode | null = null;
let gridType: "COLUMNS" | "ROWS" | null = null;
let gridSizeInPixels: number | null = null;
let currentLayoutGrid: RowsColsLayoutGrid | null = null;

figma.on("selectionchange", () => {
  const selection = figma.currentPage.selection;
  if (selection.length === 1) {
    const selectedNode = selection[0];
    // Store the selected node in the global variable
    selectedElement = selectedNode;

    // Find the nearest parent frame with a layout grid
    let currentNode = selectedNode;
    let parentFrame = null;

    while (currentNode.parent && currentNode.parent.type !== "DOCUMENT") {
      const parent = currentNode.parent;

      // Updated check to include COMPONENT and COMPONENT_SET
      if (
        "layoutGrids" in parent &&
        (parent.type === "FRAME" ||
          parent.type === "COMPONENT" ||
          parent.type === "COMPONENT_SET")
      ) {
        const grids = parent.layoutGrids;
        const layoutGrid = grids.find((grid) =>
          ["COLUMNS", "ROWS"].includes(grid.pattern)
        );

        // If we find a container with a valid layout grid, use it and break
        if (
          layoutGrid &&
          "count" in layoutGrid &&
          "offset" in layoutGrid &&
          "gutterSize" in layoutGrid
        ) {
          parentFrame = parent;
          break;
        }
      }

      currentNode = parent as SceneNode;
    }

    if (parentFrame) {
      const grids = parentFrame.layoutGrids;
      const layoutGrid = grids.find((grid) =>
        ["COLUMNS", "ROWS"].includes(grid.pattern)
      );

      if (
        layoutGrid &&
        "count" in layoutGrid &&
        "offset" in layoutGrid &&
        "gutterSize" in layoutGrid
      ) {
        // Store the layout grid globally
        currentLayoutGrid = layoutGrid;
        const frameWidth = parentFrame.width;
        const frameHeight = parentFrame.height;
        const elementWidth = selectedNode.width;
        const elementHeight = selectedNode.height;
        const gridCount = layoutGrid.count;
        const gridOffset = layoutGrid.offset;
        const gridGutter = layoutGrid.gutterSize;

        let spannedUnits: number = 0;
        let unitType: string = "";

        if (layoutGrid.pattern === "COLUMNS") {
          const availableWidth =
            frameWidth - 2 * (gridOffset ?? 0) - (gridCount - 1) * gridGutter;
          const columnWidth = availableWidth / gridCount;
          spannedUnits = Math.round(elementWidth / (columnWidth + gridGutter));
          unitType = "column";
          // Save the grid info
          gridType = "COLUMNS";
          gridSizeInPixels = columnWidth;
        } else if (layoutGrid.pattern === "ROWS") {
          const availableHeight =
            frameHeight - 2 * (gridOffset ?? 0) - (gridCount - 1) * gridGutter;
          const rowHeight = availableHeight / gridCount;
          spannedUnits = Math.round(elementHeight / (rowHeight + gridGutter));
          unitType = "row";
          // Save the grid info
          gridType = "ROWS";
          gridSizeInPixels = rowHeight;
        }
        figma.ui.postMessage({
          type: "result",
          units: spannedUnits,
          unitType: unitType,
        });
      } else {
        figma.ui.postMessage({
          type: "error",
          message: "No parent frame or component with a layout grid was found.",
        });
      }
    } else {
      figma.ui.postMessage({
        type: "error",
        message: "No parent frame or component with a layout grid was found.",
      });
    }
  } else {
    figma.ui.postMessage({
      type: "error",
      message: "Please select a single element.",
    });
  }
});

figma.ui.onmessage = (msg) => {
  if (msg.type === "close") {
    figma.closePlugin();
  }
  if (
    msg.type === "increment" &&
    selectedElement &&
    gridSizeInPixels !== null
  ) {
    if (!("resize" in selectedElement)) {
      figma.notify("Selected element cannot be resized");
      return;
    }

    if (gridType === "COLUMNS") {
      selectedElement.resize(
        selectedElement.width + gridSizeInPixels,
        selectedElement.height
      );
      const spannedUnits = Math.round(
        selectedElement.width /
          (gridSizeInPixels + (currentLayoutGrid?.gutterSize ?? 0))
      );
      figma.ui.postMessage({
        type: "result",
        units: spannedUnits,
        unitType: "column",
      });
    } else if (gridType === "ROWS") {
      selectedElement.resize(
        selectedElement.width,
        selectedElement.height + gridSizeInPixels
      );
      const spannedUnits = Math.round(
        selectedElement.height /
          (gridSizeInPixels + (currentLayoutGrid?.gutterSize ?? 0))
      );
      figma.ui.postMessage({
        type: "result",
        units: spannedUnits,
        unitType: "row",
      });
      figma.notify(`Height: ${selectedElement.height}px`);
    } else {
      figma.notify("No grid type detected");
    }
  }
  if (
    msg.type === "decrement" &&
    selectedElement &&
    gridSizeInPixels !== null
  ) {
    if (!("resize" in selectedElement)) {
      figma.notify("Selected element cannot be resized");
      return;
    }

    if (gridType === "COLUMNS") {
      selectedElement.resize(
        selectedElement.width - gridSizeInPixels,
        selectedElement.height
      );
      const spannedUnits = Math.round(
        selectedElement.width /
          (gridSizeInPixels + (currentLayoutGrid?.gutterSize ?? 0))
      );
      figma.ui.postMessage({
        type: "result",
        units: spannedUnits,
        unitType: "column",
      });
    } else if (gridType === "ROWS") {
      selectedElement.resize(
        selectedElement.width,
        selectedElement.height - gridSizeInPixels
      );
      const spannedUnits = Math.round(
        selectedElement.height /
          (gridSizeInPixels + (currentLayoutGrid?.gutterSize ?? 0))
      );
      figma.ui.postMessage({
        type: "result",
        units: spannedUnits,
        unitType: "row",
      });
    } else {
      figma.notify("No grid type detected");
    }
  }
};
