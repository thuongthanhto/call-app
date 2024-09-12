/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react'
import { FaPhone } from 'react-icons/fa'
import { toast } from 'react-toastify'

import { StringeeClient, StringeeCall } from 'stringee'
import { convertNumber, maskPhoneNumber } from '../utils'
import { CALL_TOKEN, ENV, FROM_NUMBER } from '../utils/envConfig'

const PhoneCall = ({ phoneNumber }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [client, setClient] = useState(null)
  const [currentCall, setCurrentCall] = useState(null)
  const [isCalling, setIsCalling] = useState(false)

  const videoRef = useRef(null)

  const fromNumber = FROM_NUMBER
  const callToken = CALL_TOKEN

  const handleHangup = () => {
    if (currentCall) {
      currentCall.hangup((res) => {
        console.log('Hang up result:', res)
        setCurrentCall(null)
      })
    }

    setIsOpen(false)
    setIsCalling(false)
  }

  function callStopped() {
    setTimeout(() => {
      handleHangup()
    }, 1500)
  }

  function settingClientEvents(initClient) {
    initClient.on('connect', () => {
      console.log('StringeeClient connected')
      setClient(initClient)
    })

    initClient.on('authen', function (res) {
      console.log('on authen: ', res)
      if (res.r === 0) {
        setIsCalling(false)
      } else {
        toast.error(res.message)
      }
    })

    initClient.on('otherdeviceauthen', function (data) {
      console.log('otherdeviceauthen: ', data)
    })

    initClient.on('incomingcall', (incomingCall) => {
      console.log('Incoming call:', incomingCall)
      // Automatically answer the incoming call for demonstration
      // In a real app, you'd want to show a notification and let the user choose to answer
      incomingCall.answer((res) => {
        console.log('Answer call result:', res)
      })
      setCurrentCall(incomingCall)
    })
  }

  function settingCallEvents(call1) {
    call1.on('error', (info) => {
      console.log('on error: ' + JSON.stringify(info))
    })

    call1.on('addlocalstream', (stream) => {
      console.log('on addlocalstream', stream)
    })

    call1.on('addremotestream', function (stream) {
      console.log('on addremotestream', stream)
      // reset srcObject to work around minor bugs in Chrome and Edge.
      videoRef.current.srcObject = null
      videoRef.current.srcObject = stream
    })

    call1.on('signalingstate', (state) => {
      console.log('signalingstate', state)

      if (state.code == 6) {
        // call ended
        callStopped()
      }

      if (state.code == 5) {
        // busy here
        callStopped()
      }

      const reason = state.reason
      toast.info(reason)
    })

    call1.on('mediastate', (state) => {
      console.log('mediastate ', state)
    })

    call1.on('info', (info) => {
      console.log('on info', info)
    })

    call1.on('otherdevice', (data) => {
      console.log('on otherdevice:' + JSON.stringify(data))
    })
  }

  const handlePhoneCall = () => {
    if (client) {
      console.log('Making call from:', fromNumber)
      const call = new StringeeCall(
        client,
        fromNumber,
        convertNumber(phoneNumber)
      )

      settingCallEvents(call)
      setIsCalling(true)

      call.makeCall((res) => {
        console.log('Make call result:', JSON.stringify(res))
        if (res.r !== 0) {
          toast.info(res.message)
        } else {
          // call type
          if (res.toType === 'internal') {
            console.log('App-to-App call')
          } else {
            console.log('App-to-Phone call')
          }
        }
      })
      setCurrentCall(call)
      setIsOpen(true)
    }
  }

  useEffect(() => {
    if (callToken) {
      const STRINGEE_SERVER_ADDRS = [
        'wss://v1.stringee.com:6899/',
        'wss://v2.stringee.com:6899/',
      ]

      const STRINGEE_SERVER_ADDRS_PROD = [
        'wss://ccv1.hdbank.com.vn:31122/',
        'wss://ccv2.hdbank.com.vn:31122/',
        'wss://ccv3.hdbank.com.vn:31122/',
      ]

      const serverAddrs =
        ENV === 'prod' ? STRINGEE_SERVER_ADDRS_PROD : STRINGEE_SERVER_ADDRS

      const initClient = new StringeeClient(serverAddrs)
      initClient.connect(callToken)

      settingClientEvents(initClient)
    }

    return () => {
      if (client) {
        client.disconnect()
      }
    }
  }, [callToken])

  return (
    <div>
      <div className="flex items-center">
        <button
          className="text-blue-500 font-semibold"
          onClick={handlePhoneCall}
        >
          Call {maskPhoneNumber(phoneNumber)}
        </button>

        {isOpen ? (
          <>
            <video
              ref={videoRef}
              playsInline
              autoPlay
              style={{ height: 10, width: 10 }}
            ></video>
            <button
              className="bg-red-500 text-white w-[40px] h-[40px] rounded-full cursor-pointer text-[24px]"
              disabled={!isCalling}
              onClick={handleHangup}
            >
              <FaPhone className="text-[24px]" />
            </button>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default PhoneCall
