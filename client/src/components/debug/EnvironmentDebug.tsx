// import React from 'react'

// export function EnvironmentDebug() {
//   const envVars = {
//     'VITE_CLERK_PUBLISHABLE_KEY': import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
//     'VITE_API_BASE_URL': import.meta.env.VITE_API_BASE_URL,
//     'VITE_GITHUB_CLIENT_ID': import.meta.env.VITE_GITHUB_CLIENT_ID,
//     'VITE_APP_URL': import.meta.env.VITE_APP_URL,
//     'Current Origin': window.location.origin,
//     'Current Pathname': window.location.pathname,
//     'Current URL': window.location.href,
//   }

//   // Only show in development
//   if (import.meta.env.PROD) {
//     return null
//   }

//   return (
//     <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-md z-50">
//       <h3 className="font-bold mb-2">Environment Debug</h3>
//       {Object.entries(envVars).map(([key, value]) => (
//         <div key={key} className="mb-1">
//           <span className="text-blue-400">{key}:</span>{' '}
//           <span className="text-green-400">{value || 'undefined'}</span>
//         </div>
//       ))}
//     </div>
//   )
// }
