import { AddPost } from './AddPost';
import { Posts } from './Posts';

export function PostsSection(){
    return(
        <div className="posts__section">
            <AddPost />
            <Posts />
        </div>
    )
}