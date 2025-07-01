import Home from "./pages/home/Home.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/auth/SignIn.jsx";
import Feed from "./pages/Feed/Feed.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import MyNetwork from "./pages/MyNetwork/MyNetwork.jsx";
import Message from "./pages/Messages/Message.jsx";
import Notification from "./pages/Notification/Notification.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Bio from "./pages/Profile/Bio.jsx";
import About from "./pages/Profile/About/About.jsx";
import Education from "./pages/Profile/Education/AddEducation.jsx";
import Experience from "./pages/Profile/Experience/AddExperience.jsx";
import EditEducation from "./pages/Profile/Education/EditEducation.jsx";
import EditExperience from "./pages/Profile/Experience/EditExperience.jsx";
import AIGenerate from "./pages/AI_postGen/AIGenerate.jsx";

const App = () => {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path = "/sign-in/:initial" element = {<SignIn />} />
        <Route path = "/feed" element = {<Feed />} />
        <Route path = "/create-post" element = {<CreatePost />} />
        <Route path = "/my-network" element = {<MyNetwork />} />
        <Route path = "/messages" element = {<Message />} />
        <Route path = "/notifications" element = {<Notification />} />
        <Route path = "/profile/:id" element = {<Profile />} />
        <Route path = "/profile/:user_id/bio" element = {<Bio />} />
        <Route path = "/profile/:user_id/about" element = {<About />} />
        <Route path = "/profile/:user_id/education" element = {<Education />} />
        <Route path = "/profile/:user_id/experience" element = {<Experience />} />
        <Route path = "/profile/:user_id/education/:edu_id" element = {<EditEducation />} />
        <Route path = "/profile/:user_id/experience/:exp_id" element = {<EditExperience />} />
        <Route path = "/aiGenerate" element = {<AIGenerate />} />
      </Routes>
    </BrowserRouter>
   
  );
};

export default App;
