import { useAuth } from "@/hooks/useAuth";
import CustomerHome from "./CustomerHome";
import WorkerPostFeed from "@/components/WorkerPostFeed";

const AppHome = () => {
  const { role } = useAuth();

  if (role === "customer") {
    return <CustomerHome />;
  }

  if (role === "worker") {
    return <WorkerPostFeed />
  }

  return null;
};

export default AppHome;
