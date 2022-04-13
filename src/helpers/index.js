function generateWeekRange(futureOffset = 0) {
  var today = new Date();

  if (futureOffset) today.setDate(today.getDate() + 1);

  var aWeekAgo = new Date();
  aWeekAgo.setDate(today.getDate() - 7);
  return [aWeekAgo.toISOString().split("T")[0], today.toISOString().split("T")[0]];
}

function validateFileSizes(files, size) {
  for (var file of files) {
    if (file.size > size * 1000 * 1000) return `Size limit is ${size} MB`;
  }
  return true;
}

export { generateWeekRange, validateFileSizes };
