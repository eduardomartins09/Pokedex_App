import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { PokemonProvider } from './contexts/pokemonsContext.tsx'
import Home from './pages/Home/Home.tsx'
import PokemonDetails from './pages/PokemonDetails/PokemonDetails.tsx'
import Navbar from './components/Navbar/Navbar.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <PokemonProvider>
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/pokemonDetails/:id' element={<PokemonDetails />} />
        </Routes>
      </BrowserRouter>
    </PokemonProvider>
  </React.StrictMode>,
)
