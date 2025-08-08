import { useToast } from "@chakra-ui/react";
import AlertModal from "../shared/AlertDialog";
import { useDeleteDashboardProductMutation } from "@/app/services/apiSlice";

interface IProps {
  onClose: () => void;
  isOpen: boolean;
  clickedProductToRemove: string;
}

const RemoveAlert = ({ clickedProductToRemove, isOpen, onClose }: IProps) => {
  const toast = useToast();
  const [deleteProduct, { isSuccess: isProductRemove, isLoading }] =
    useDeleteDashboardProductMutation();
  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isLoading}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        acceptTxt="Yes"
        rejectTxt="Cancel"
        onCLick={async () => {
          await deleteProduct(clickedProductToRemove);
          onClose();
          if (isProductRemove) {
            toast({
              title: "Product Deleted Successfully.",
              status: "success",
              duration: 2000,
              isClosable: true,
            });
          }
        }}
      />
    </>
  );
};

export default RemoveAlert;
