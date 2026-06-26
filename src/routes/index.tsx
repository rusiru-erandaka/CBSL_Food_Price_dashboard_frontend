import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import { ErrorState } from "@/components/common/ErrorState";
import { PageContainer } from "@/components/layout/PageContainer";
import { DashboardPage } from "@/pages/DashboardPage";
import { FoodDetailsPage } from "@/pages/FoodDetailsPage";

function RouteErrorPage() {
  return (
    <PageContainer>
      <ErrorState
        title="Route not available"
        message="The requested page could not be rendered. Return to the dashboard and try again."
      />
    </PageContainer>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "food/:foodName",
        element: <FoodDetailsPage />,
      },
    ],
  },
]);
