import { Provider } from 'react-redux';
import { store } from './app/store';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//****COMPONENTS*****//
import { Nav } from './Nav';
import { PostsSection } from './features/posts/PostsSection'
import { ViewPost } from './features/posts/SinglePostPage';
import { NoMatch } from './components/NoMatch';
import { Users } from './features/users/Users';
import { ShowUser } from './features/users/ShowUser';
import { Notifications } from './features/notifications/Notifications';
import { EditPost } from './features/posts/EditPost';
// ***** style *****
import './style/style.css';
// import hell
function Main(){
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Nav />} >
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

function App() {
    return (
        <Provider store={store}>
            <Main />
        </Provider>
    )
};

export default App;