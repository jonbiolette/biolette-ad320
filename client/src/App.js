import React from 'react'
import logo from './logo.svg';
import './App.css';
import Topbar from './components/Topbar/Topbar'
import CardNavigation from './components/CardNavigation/CardNavigation'
import FlashCard from './components/FlashCard/FlashCard';

function App() {
    return (
      <React.Fragment>
            <Topbar />
            <div style={{ display: 'flex' }}>
                <CardNavigation />
                <FlashCard />
            </div>
      </React.Fragment>
  );
}

export default App;
