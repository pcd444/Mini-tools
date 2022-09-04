
export function DeleteRow(table, row) {
  table = structuredClone(table);
  table.splice(row, 1);
  return table;
}
export function AddRowAfter(table, row) {
  const colCount = table[0].length;
  table = structuredClone(table);
  let beggining = table;
  let end = table.splice(row + 1);
  beggining.push(new Array(colCount).fill(''));
  return beggining.concat(end);
}
export function AddRowBefore(table, row) {
  const colCount = table[0].length;
  table = structuredClone(table);
  let beggining = table;
  let end = table.splice(row);
  beggining.push(new Array(colCount).fill(''));
  return beggining.concat(end);
}
export function DeleteCol(table, col) {
  table = structuredClone(table);
  for (let row of table)
    row.splice(col, 1);
  return table
}
export function AddColAfter(table, col) {
  table = structuredClone(table);
  return table.map(row => {
    let rowStart = row;
    let rowEnd = row.splice(col + 1);
    rowStart.push('');
    return rowStart.concat(rowEnd);
  });
}
export function AddColBefore(table, col) {
  table = structuredClone(table);
  return table.map(row => {
    let rowStart = row;
    let rowEnd = row.splice(col);
    rowStart.push('');
    return rowStart.concat(rowEnd);
  });
}

