import './App.css'
import Home from './components/Home.jsx';
import SocketPro from './SocketPro.jsx';
import PeerPro from './PeerPro.jsx';
function App() {


  return (
   <>
      <SocketPro>
        <PeerPro>
      <Home/>
      </PeerPro>
      </SocketPro>
      
   </>
      
  )
}

export default App
