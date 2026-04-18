import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import authService from "./appwrite/auth";
import { login, logOut } from "./store/authSlice";
import { AuthLayout, Footer, Header } from "./component";
import AddPost from "./pages/AddPost";
import AllPosts from "./pages/AllPosts";
import EditPost from "./pages/EditPost";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Post from "./pages/Post";
import SignUp from "./pages/signUp";


function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login(userData));
        } else {
          dispatch(logOut());
        }
      })
      .catch(() => {
        dispatch(logOut());
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="glass-card rounded-2xl px-8 py-6 text-center">
          <h2 className="text-xl font-semibold text-slate-900">Setting things up</h2>
          <p className="mt-2 text-slate-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8 md:py-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <AuthLayout authentication={false}>
                <Login />
              </AuthLayout>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthLayout authentication={false}>
                <SignUp />
              </AuthLayout>
            }
          />
          <Route
            path="/all-posts"
            element={
              <AuthLayout authentication>
                <AllPosts />
              </AuthLayout>
            }
          />
          <Route
            path="/add-post"
            element={
              <AuthLayout authentication>
                <AddPost />
              </AuthLayout>
            }
          />
          <Route
            path="/edit-post/:slug"
            element={
              <AuthLayout authentication>
                <EditPost />
              </AuthLayout>
            }
          />
          <Route path="/post/:slug" element={<Post />} />
          <Route
            path="*"
            element={
              <div className="mx-auto max-w-xl px-4">
                <div className="glass-card rounded-2xl p-8 text-center">
                  <h2 className="text-2xl font-semibold text-slate-900">Page not found</h2>
                  <p className="mt-2 text-slate-600">The page you are looking for does not exist.</p>
                </div>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
