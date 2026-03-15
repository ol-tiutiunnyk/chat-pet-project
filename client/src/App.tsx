
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import { Register, Login, RequireAuth, RedirectIfAuth } from "@/auth";
import { Chat } from "@/chat";
import { Conversations } from "@/conversations";
import store from "@/store";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RequireAuth><Conversations /></RequireAuth>} />
          <Route path="/chat/:conversationId" element={<RequireAuth><Chat /></RequireAuth>} />
          <Route path="/register" element={<RedirectIfAuth><Register /></RedirectIfAuth>} />
          <Route path="/login" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};
export default App;
