import {Route, Routes, useLocation} from "react-router-dom";
import {useEffect} from "react";

function App() {
    const {pathname} = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

  return (
    <>
        <Routes>
            <Route path="/" element={<h1>Hello World</h1>} />
        </Routes>
    </>
  )
}

export default App
