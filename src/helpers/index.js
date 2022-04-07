function generateWeekRange(futureOffset = 0) {
  var today = new Date();

  if (futureOffset) today.setDate(today.getDate() + 1);

  var aWeekAgo = new Date();
  aWeekAgo.setDate(today.getDate() - 7);
  return [aWeekAgo.toISOString().split("T")[0], today.toISOString().split("T")[0]];
}

export { generateWeekRange };
