async function printGrid(url) {
  // Convert Google Doc URL to published format if needed
  let fetchUrl = url;
  const editMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)\/edit/);
  if (editMatch) {
    fetchUrl = `https://docs.google.com/document/d/${editMatch[1]}/pub`;
  }

  const response = await fetch(fetchUrl);
  const html = await response.text();

  // Parse the HTML table rows: x-coordinate | Character | y-coordinate
  const rowRegex = /<tr[^>]*>[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>[\s\S]*?<\/tr>/gi;

  const characters = [];
  let maxX = 0;
  let maxY = 0;
  let match;

  while ((match = rowRegex.exec(html)) !== null) {
    const col1 = match[1].replace(/<[^>]*>/g, "").trim();
    const col2 = match[2].replace(/<[^>]*>/g, "").trim();
    const col3 = match[3].replace(/<[^>]*>/g, "").trim();

    const x = parseInt(col1);
    const y = parseInt(col3);

    if (Number.isNaN(x) || Number.isNaN(y) || col2.length === 0) continue;

    characters.push({ char: col2, x, y });
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  // Build grid: (0,0) top-left, x goes right, y goes down
  const grid = [];
  for (let row = 0; row <= maxY; row++) {
    grid.push(new Array(maxX + 1).fill(" "));
  }

  for (const { char, x, y } of characters) {
    grid[y][x] = char;
  }

  // Print the grid
  for (const row of grid) {
    console.log(row.join(""));
  }
}

// Run with URL from command line or default to example
printGrid(
  process.argv[2] ||
    "https://docs.google.com/document/d/e/2PACX-1vSvM5gDlNvt7npYHhp_XfsJvuntUhq184By5xO_pA4b_gCWeXb6dM6ZxwN8rE6S4ghUsCj2VKR21oEP/pub"
);
