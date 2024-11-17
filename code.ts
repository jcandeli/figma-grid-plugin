figma.showUI(__html__);

figma.ui.resize(350, 335);

figma.on("selectionchange", () => {
  const selection = figma.currentPage.selection;
  if (selection.length === 1) {
    const selectedNode = selection[0];

    // Find the nearest parent frame with a layout grid
    let currentNode = selectedNode;
    let parentFrame = null;

    while (currentNode.parent && currentNode.parent.type !== "DOCUMENT") {
      const parent = currentNode.parent;

      // Check if the parent has layoutGrids and is a frame-like container
      if ("layoutGrids" in parent && parent.type === "FRAME") {
        const grids = parent.layoutGrids;
        const layoutGrid = grids.find((grid) =>
          ["COLUMNS", "ROWS"].includes(grid.pattern)
        );

        // If we find a frame with a valid layout grid, use it and break
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
        } else if (layoutGrid.pattern === "ROWS") {
          const availableHeight =
            frameHeight - 2 * (gridOffset ?? 0) - (gridCount - 1) * gridGutter;
          const rowHeight = availableHeight / gridCount;
          spannedUnits = Math.round(elementHeight / (rowHeight + gridGutter));
          unitType = "row";
        }
        figma.ui.postMessage({
          type: "result",
          units: spannedUnits,
          unitType: unitType,
        });
      } else {
        figma.ui.postMessage({
          type: "error",
          message: "The parent frame doesn't have a valid layout grid.",
        });
      }
    } else {
      figma.ui.postMessage({
        type: "error",
        message: "No parent frame with a layout grid was found.",
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
};
