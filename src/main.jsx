import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import '@fontsource/overpass/400.css'
import '@fontsource/overpass/600.css'
import '@fontsource/overpass/800.css'
import '@fontsource/overpass/900.css'
import '@fontsource/archivo-black/400.css'
import '@fontsource/courier-prime/700.css'
import '@fontsource/oswald/300.css'
import './styles.css'

createRoot(document.getElementById('root')).render(<App />)
