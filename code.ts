figma.showUI(__html__);

figma.ui.resize(350, 200);

figma.on("selectionchange", () => {
  const selection = figma.currentPage.selection;
  if (selection.length === 1) {
    const selectedNode = selection[0];
    const parentFrame = selectedNode.parent;

    if (parentFrame && "layoutGrids" in parentFrame) {
      const grids = parentFrame.layoutGrids;
      const layoutGrid = grids.find((grid) =>
        ["COLUMNS", "ROWS"].includes(grid.pattern)
      );
      console.log(layoutGrid);
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
          message: `${spannedUnits} ${unitType}${
            spannedUnits === 1 ? "" : "s"
          }`,
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
        message:
          "The selected element is not inside a frame with a layout grid.",
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
