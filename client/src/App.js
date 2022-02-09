import React from 'react'
import logo from './logo.svg';
import './App.css';
import Topbar from './components/Topbar/Topbar'
import CardNavigation from './components/CardNavigation/CardNavigation'
import FlashCard from './components/FlashCard/FlashCard';
import Button from './components/Button/Button';

function App() {
    return (
      <React.Fragment>
            <Topbar />
            <div className = 'container'>
                <CardNavigation />
                <div className= 'card'>
                    <FlashCard />
                    <div className = 'cardControls'>
                    <Button text = "Back"/>
                    <Button text='Flip'/>
                    <Button text='Next'/>
                    </div>
                </div>
            </div>
      </React.Fragment>
  );
}

export default App;
