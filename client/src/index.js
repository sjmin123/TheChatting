import React from "react";

//테스트(개발) 할 때는 MockedApp을, 실제로 db와 연동할 때는 App을 사용하면 됨.
import App from "./App";
import MockedApp from "./MockedApp";

import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);

// const rootElement = document.getElementById("root");
// ReactDOM.render(<MockedApp />, rootElement);
