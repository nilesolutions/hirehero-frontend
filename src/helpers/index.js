function generateWeekRange(futureOffset = 0) {
  const today = new Date()

  if (futureOffset) today.setDate(today.getDate() + 1)

  const aWeekAgo = new Date()
  aWeekAgo.setDate(today.getDate() - 7)
  return [aWeekAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]]
}

function validateFileSizes(files, size) {
  for (const file of files) {
    if (file.size > size * 1000 * 1000) return `Size limit is ${size} MB`
  }
  return true
}

function relativeDate(value) {
  const date = new Date(value)
  const deltaDays = (date.getTime() - Date.now()) / (1000 * 3600 * 24)
  const formatter = new Intl.RelativeTimeFormat()
  return formatter.format(Math.round(deltaDays), 'days')
}

function resolveProfilePic(user) {
  if (!user.profile_picture_url) return require('@/assets/images/default-profile-pic.jpg')
  return user.profile_picture_url
}

export {
  generateWeekRange, validateFileSizes, relativeDate, resolveProfilePic,
}
