
import Chat from "../Components/Chat";   
import Sidebar from "../Components/Sidebar";   

const Home = () => {
  return (
    <div className='home'>
        <div className="home-container">
           <Sidebar/>
           <Chat/>
        </div>
    </div>
  );
}

export default Home;
