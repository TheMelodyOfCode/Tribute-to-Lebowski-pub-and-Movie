import {Routes, Route} from 'react-router-dom';

import Header from './components/header/header.component';
import Home from './routes/home/home.component'



const Shop = ()=> {
  return <h1>I am the Shop Page</h1>
}

const App = () => {

  return (
    <Routes>
      <Route path='/' element={<Header/>} >
        <Route index     element={<Home/>} />
        <Route path='shop'   element={<Shop/>} />
      </Route>
    </Routes>
  );

}

export default App;