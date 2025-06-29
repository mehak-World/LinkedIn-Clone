import React, {useContext} from 'react'
import HomeNav from "../../components/HomeNav"
import HomeBody from "../../components/HomeBody"
import { UserContext } from '../../utils/UserContext'

const Home = () => {
  const {user} = useContext(UserContext)
  console.log(user)
  return (
    <div>
      <HomeNav />
      <HomeBody />
    </div>
  )
}

export default Home
