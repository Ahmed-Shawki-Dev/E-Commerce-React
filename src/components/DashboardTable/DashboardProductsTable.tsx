import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Image,
  Button,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { Eye, PenLine, Trash2 } from "lucide-react";
import { useState } from "react";
import TableSkeleton from "@/components/ui/TableSkeleton";
import { useGetDashboardProductsQuery } from "@/app/services/apiSlice";
import type { IProduct } from "@/interfaces";
import UpdateModal from "./UpdateModal";
import AddModal from "./AddModal";
import RemoveAlert from "./RemoveAlert";
import { useNavigate } from "react-router-dom";

const DashboardProductsTable = () => {
  // Update A Product
  const [productToUpdate, setProductToUpdate] = useState<IProduct>({
    documentId: "",
    title: "",
    description: "",
    price: 0,
    stock: 0,
    category: {
      title: "",
      documentId: "",
    },
  });
  const {
    isOpen: isUpdateModalOpen,
    onClose: onCloseUpdateModal,
    onOpen: onOpenUpdateModal,
  } = useDisclosure();

  // Add A Product

  const {
    isOpen: isAddModalOpen,
    onOpen: onOpenAddModal,
    onClose: onCloseAddModal,
  } = useDisclosure();

  // Remove Dashboard Product
  const {
    isOpen: isRemoveOpen,
    onOpen: onOpenRemove,
    onClose: onCloseRemove,
  } = useDisclosure();
  const [clickedProductToRemove, setClickedProductToRemove] = useState("");

  // Get Dashboard Products
  const { isLoading: isDashboardProductLoading, data: products } =
    useGetDashboardProductsQuery();

  // Show Product Details
  const navigate = useNavigate();

  if (isDashboardProductLoading) return <TableSkeleton />;

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <Button colorScheme="blue" color={"white"} onClick={onOpenAddModal}>
        Add Product
      </Button>
      <TableContainer overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>TITLE</Th>
              <Th>CATEGORY</Th>
              <Th>THUMBNAIL</Th>
              <Th>PRICE</Th>
              <Th>STOCK</Th>
              <Th>ACTION</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products?.data.map((product: IProduct) => (
              <Tr key={product?.documentId}>
                <Td>{product?.documentId}</Td>
                <Td>{product?.title}</Td>
                <Td>{product?.category?.title ?? ""}</Td>
                <Td>
                  <Image
                    src={`${product.thumbnail?.url}`}
                    boxSize="60px"
                    borderRadius="md"
                    objectFit="cover"
                    flexShrink={0}
                  />
                </Td>
                <Td>{product?.price}</Td>
                <Td>{product?.stock}</Td>
                <Td>
                  <Button
                    mr={2}
                    onClick={() => {
                      navigate(`/products/${product.documentId}`);
                    }}
                  >
                    <Eye />
                  </Button>
                  <Button
                    mr={2}
                    onClick={() => {
                      onOpenRemove();
                      setClickedProductToRemove(product.documentId ?? "");
                    }}
                  >
                    <Trash2 />
                  </Button>
                  <Button
                    onClick={() => {
                      setProductToUpdate(product);
                      onOpenUpdateModal();
                    }}
                  >
                    <PenLine />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <AddModal isOpen={isAddModalOpen} onClose={onCloseAddModal} />

      <UpdateModal
        onClose={onCloseUpdateModal}
        isOpen={isUpdateModalOpen}
        productToUpdate={productToUpdate}
        setProductToUpdate={setProductToUpdate}
      />

      <RemoveAlert
        clickedProductToRemove={clickedProductToRemove}
        isOpen={isRemoveOpen}
        onClose={onCloseRemove}
      />
    </Flex>
  );
};

export default DashboardProductsTable;
