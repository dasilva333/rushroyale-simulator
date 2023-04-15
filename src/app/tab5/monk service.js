function isIntersectionNode(board, row, col) {
  const numRows = board.length;
  const numCols = board[0].length;
  
  // Check if the node is an M
  if (board[row][col] !== 'M') {
    return false;
  }
  
  // Check if all nodes to the left are M
  for (let c = col - 1; c >= 0; c--) {
    if (board[row][c] !== 'M') {
      break;
    }
    if (c === 0) {
      return true;
    }
  }
  
  // Check if all nodes to the right are M
  for (let c = col + 1; c < numCols; c++) {
    if (board[row][c] !== 'M') {
      break;
    }
    if (c === numCols - 1) {
      return true;
    }
  }
  
  // Check if all nodes above are M
  for (let r = row - 1; r >= 0; r--) {
    if (board[r][col] !== 'M') {
      break;
    }
    if (r === 0) {
      return true;
    }
  }
  
  // Check if all nodes below are M
  for (let r = row + 1; r < numRows; r++) {
    if (board[r][col] !== 'M') {
      break;
    }
    if (r === numRows - 1) {
      return true;
    }
  }
  
  return false;
}