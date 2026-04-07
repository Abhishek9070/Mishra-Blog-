import { useState , useEffect } from 'react'
import authService from './appwrite/auth'
import { useDispatch } from "react-redux";
import { login,logOut } from './store/authSlice';
import { Header, Footer } from './component';


function App() {
  const [loading , setLoading] = useState(true)
  const dispatch=useDispatch()

  useEffect(()=>{
    authService.getCurrentUser()
    .then((userData)=>{
      if(userData) dispatch(login(userData))
      else dispatch(logOut())
    })
    .catch(()=>{
      dispatch(logOut())
    })
    .finally(()=>setLoading(false))
  },[])
  if(loading){
    return <div className='min-h-screen grid place-items-center text-lg font-semibold'>Loading app...</div>
  }

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col'>
      <Header/>
      <main className='flex-1 p-6'>
        <div className='max-w-3xl mx-auto bg-white rounded-lg shadow p-6'>
          <h2 className='text-xl font-semibold mb-2'>App is working</h2>
          <p className='text-gray-700'>You can now see Header, main content, and Footer on the page.</p>
        </div>
      </main>
      <Footer/>
    </div>
  )
}

export default App
