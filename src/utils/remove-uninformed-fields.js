export function removeUninformedFields(data) {
  const removeOptions = [null, undefined, '']
  
  Object.keys(data).forEach(key => {
    if (removeOptions.includes(data[key])) {
      delete data[key]
    }
  })

  return data
}