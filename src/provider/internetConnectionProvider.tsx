import { useToast } from "@chakra-ui/react";
import { Wifi } from "lucide-react";
import { useEffect,  type ReactNode } from "react";

const InternetConnectionProvider = ({ children }: { children: ReactNode }) => {
  const toast = useToast();
  useEffect(() => {
    const handleOnline = () => {
      toast.closeAll();
    };
    const handleOffline = () => {
      toast({
        title: "No Internet",
        status: "error",
        icon: <Wifi />,
        duration: null,
        isClosable: false,
        colorScheme:"blue" 
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [toast]);

  return <>{children}</>;
};

export default InternetConnectionProvider;
