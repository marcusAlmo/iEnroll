import { BrowserRouter } from "react-router";
import AppRouter from "./router";
import { EnrollmentReviewProvider } from "./admin/context/enrollmentReviewContext";

function App() {
  return (
    <EnrollmentReviewProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </EnrollmentReviewProvider>
  );
}

export default App;
