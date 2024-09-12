import { useState } from 'react'
import PhoneCall from './components/PhoneCall'

function App() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [error, setError] = useState('')
  const [showCallButton, setShowCallButton] = useState(false)

  const validatePhoneNumber = (input) => {
    // Basic validation to check if the input is 10 digits
    const isValid = /^\d{10}$/.test(input)
    if (!isValid) {
      setError('Please enter a valid 10-digit phone number')
    } else {
      setError('')
    }
    return isValid
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validatePhoneNumber(phoneNumber)) {
      setShowCallButton(true)
    }
  }

  return (
    <div className="flex flex-col items-center pt-[50px] max-w-[450px] mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div className="mx-auto">
          <label
            htmlFor="phone-number"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phone-number"
            name="phone-number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your phone number"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <div className="mx-auto">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </form>

      {showCallButton ? (
        <div className="mt-[50px]">
          <PhoneCall phoneNumber={phoneNumber} />
        </div>
      ) : null}
    </div>
  )
}

export default App
