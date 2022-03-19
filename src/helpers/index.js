function generateWeekRange() {
  var today = new Date();
  var aWeekAgo = new Date();
  aWeekAgo.setDate(today.getDate() - 7);
  return [aWeekAgo.toISOString().split("T")[0], today.toISOString().split("T")[0]];
}

export { generateWeekRange };
