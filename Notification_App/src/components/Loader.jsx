import { MoonLoader } from 'react-spinners';

export function Loader() {
    return (
        <div className="loading">
            <MoonLoader
                size={80}
                color="purple"
                loading
            />
        </div>
    )
};