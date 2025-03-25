import AppRouter from "./router";
import { EnrollmentReviewProvider } from "./admin/context/enrollmentReviewContext";

function App() {
  return (
    <EnrollmentReviewProvider>
      <AppRouter />
    </EnrollmentReviewProvider>
  );
}

export default App;
