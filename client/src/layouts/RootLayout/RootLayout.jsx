import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const RootLayout = () => {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <div className="rootLayout h-screen flex flex-col">
          <main className="flex-1 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </QueryClientProvider>
    </div>
  );
};

export default RootLayout;
