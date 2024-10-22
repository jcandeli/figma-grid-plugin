# Grid Column Calculator - Figma Plugin

This is a simple Figma plugin that calculates how many grid columns a selected element spans within its parent frame.

## Features

- Automatically detects the column grid of the parent frame
- Calculates the number of columns spanned by the selected element
- Provides real-time feedback as you select different elements
- Displays error messages for invalid selections or frames without column grids

## How to Use

1. Select an element within a frame that has a column grid
2. The plugin will display the number of columns the element spans
3. If you select a different element, the calculation will update automatically

## Code Structure

The plugin consists of three main files:

1. `code.js`: The main plugin code that interacts with the Figma API
2. `ui.html`: The HTML file for the plugin's user interface
3. `manifest.json`: The plugin manifest file

## How It Works

1. The plugin listens for changes in the user's selection
2. When a single element is selected, it checks if the parent frame has a column grid
3. If a column grid is found, it calculates the number of columns spanned based on the element's width and the grid properties
4. The result is displayed in the plugin UI
5. If there are any errors (e.g., no selection, multiple selections, or no column grid), an appropriate error message is shown

## Development

To modify or extend this plugin:

1. Clone the repository
2. Make changes to the code in `code.js`, `ui.html`, or `manifest.json`
3. Test your changes in Figma by loading the plugin as a development plugin
4. Once satisfied, publish your updated version through the Figma plugin submission process
