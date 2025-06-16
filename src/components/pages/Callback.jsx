import React, { useEffect } from 'react'

const Callback = () => {
  useEffect(() => {
    const { ApperUI } = window.ApperSDK
    ApperUI.showSSOVerify("#authentication-callback")
  }, [])
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50">
      <div id="authentication-callback" className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your account...</p>
        </div>
      </div>
    </div>
  )
}

export default Callback