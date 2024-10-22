figma.showUI(__html__);

figma.ui.resize(350, 200);

figma.on("selectionchange", () => {
  const selection = figma.currentPage.selection;
  if (selection.length === 1) {
    const selectedNode = selection[0];
    const parentFrame = selectedNode.parent;

    if (parentFrame && "layoutGrids" in parentFrame) {
      const grids = parentFrame.layoutGrids;
      const columnGrid = grids.find((grid) => grid.pattern === "COLUMNS");
      if (
        columnGrid &&
        "count" in columnGrid &&
        "offset" in columnGrid &&
        "gutterSize" in columnGrid
      ) {
        const frameWidth = parentFrame.width;
        const elementWidth = selectedNode.width;
        const gridCount = columnGrid.count;
        const gridOffset = columnGrid.offset;
        const gridGutter = columnGrid.gutterSize;

        const availableWidth =
          frameWidth - 2 * gridOffset - (gridCount - 1) * gridGutter;
        const columnWidth = availableWidth / gridCount;

        const spannedColumns = Math.round(
          elementWidth / (columnWidth + gridGutter)
        );

        figma.ui.postMessage({
          type: "result",
          message: `${spannedColumns} column${ spannedColumns === 1 ? "" : "s" }`,
        });
      } else {
        figma.ui.postMessage({
          type: "error",
          message: "The parent frame doesn't have a column grid.",
        });
      }
    } else {
      figma.ui.postMessage({
        type: "error",
        message: "The selected element is not inside a frame with a column grid.",
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
