import './index.css'
import './App.css'
import Search from './components/Search'
import { useState } from 'react';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
    <main>
      <div className="pattern" />

      <div className='wrapper'>
        <header>
           {/* <img src="./BG.png" alt="background" /> */}
          <img src="./hero-img.png" alt="hero banner" />
         
          <h1>Find <span className='text-gradient'>Movies</span>  You'll Love without the Work</h1>
        </header>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      </div>
    </main>
     
    </>
  )
}

export default App
