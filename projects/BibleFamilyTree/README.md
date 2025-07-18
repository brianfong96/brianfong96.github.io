# Bible Family Tree

Visualize genealogies of biblical characters in a simple D3.js tree. The project is a static site that can be viewed on GitHub Pages or locally in any modern browser.

## View the app
Open [Bible Family Tree](https://brianfong96.github.io/projects/BibleFamilyTree/) in your browser. The data is embedded directly in the page, so you can also open `index.html` locally without starting a server.

## Editing the data
Family relationships are stored in `data/family_tree.js` as a JavaScript array. You can edit this file by hand or use the helper CLI:

```bash
python3 scripts/edit_data.py add "Abel" --parents adam-001 --references "Genesis 4:2" --notes "Son of Adam"
```

Use `delete` to remove a person by ID:

```bash
python3 scripts/edit_data.py delete abel-001
```

The script automatically generates unique IDs and validates verse reference format.

The interface supports mouse wheel zooming and a search box to highlight specific people by name, alias or ID.
Click a person to collapse or expand their branch.
Use the **Toggle Dragging** button to reposition nodes manually when needed.

## Requirements
- Any modern web browser
- Python 3.8+ to run `edit_data.py`

View the full source on [GitHub](https://github.com/brianfong96/brianfong96.github.io/tree/master/projects/BibleFamilyTree).
