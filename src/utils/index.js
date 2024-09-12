export const maskPhoneNumber = (phoneNumber) => {
  return phoneNumber
    ? `${phoneNumber.substring(0, 4)}***${phoneNumber.substring(
        phoneNumber.length - 2
      )}`
    : null
}

export const convertNumber = (originalNumber) => {
  const prefix = '84'
  // Ensure originalNumber is a string, then prepend '84'
  const newNumber = `${prefix}${
    originalNumber.startsWith('0')
      ? originalNumber.substring(1)
      : originalNumber
  }`

  return newNumber
}