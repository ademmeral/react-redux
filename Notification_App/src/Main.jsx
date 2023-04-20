import { AppNav } from './AppNav';
import { PostsSection } from './features/posts/PostsSection'
import { ViewPost } from './features/posts/SinglePostPage';
import { NoMatch } from './components/NoMatch';
import { Users } from './features/users/Users';
import { ShowUser } from './features/users/ShowUser';
import { Notifications } from './features/notifications/Notifications';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { EditPost } from './features/posts/EditPost';
// import hell
export function Main(){
    return (
        <Router>
            <Routes>
                <Route path='/' element={<AppNav />} >
                    <Route path='*' element={<NoMatch />} />
                    <Route path='posts' element={<PostsSection/>}/>
                    <Route path='posts/:postId' element={<ViewPost />}/>
                    <Route path='posts/404' element={<NoMatch/>} />
                    <Route path='posts/edit/:postId' element={<EditPost/>} />
                    <Route path='users' element={<Users/>}/>
                    <Route path='users/:userId' element={<ShowUser/>}/>
                    <Route path='users/404' element={<NoMatch/>}/>
                    <Route path='notifications' element={<Notifications/>}/>
                    <Route path='notifications/*' element={<NoMatch/>}/>
                </Route>
            </Routes>
        </Router>
    )
};

