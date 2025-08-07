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
  useToast,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  ButtonGroup,
  Textarea,
  Flex,
  Select,
} from "@chakra-ui/react";

// Icons
import { Eye, PenLine, Trash2 } from "lucide-react";

// React
import { useState, type ChangeEvent, type FormEvent } from "react";
import { v4 as uuid } from "uuid";
// Components
import TableSkeleton from "@/components/ui/TableSkeleton";
import AlertModal from "./shared/AlertDialog";
import ModalDialog from "./shared/Modal";

// API
import {
  useAddProductMutation,
  useDeleteDashboardProductMutation,
  useGetCategoriesQuery,
  useGetDashboardProductsQuery,
  // useUpdateDashboardProductMutation,
  useUpdateProductMutation,
} from "@/app/services/apiSlice";

// Constants
import { BASE_URL } from "@/config/index.config";

// Types
import type { ICategory, IProduct } from "@/interfaces";
import CookieService from "@/services/CookieService";

const DashboardProductsTable = () => {
  // Chakra Hooks
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isUpdateModalOpen,
    onOpen: onOpenUpdateModal,
    onClose: onCloseUpdateModal,
  } = useDisclosure();
  const {
    isOpen: isAddModalOpen,
    onOpen: onOpenAddModal,
    onClose: onCloseAddModal,
  } = useDisclosure();
  const toast = useToast();

  // RTK Query
  const { isLoading: isDashboardProductLoading, data: products } =
    useGetDashboardProductsQuery();
  const { data: categories } = useGetCategoriesQuery();
  const [
    deleteProduct,
    { isSuccess: isProductRemove, isLoading: isProductRemoveLoading },
  ] = useDeleteDashboardProductMutation();

  // Local State
  const [clickedProduct, setClickedProduct] = useState("");
  const [productToUpdate, setProductToUpdate] = useState<IProduct>({
    documentId: "",
    title: "",
    description: "",
    price: 0,
    stock: 0,
    category: {
      title: "",
    },
    thumbnail: {
      url: "",
    },
  });
  const [productToAdd, setProductToAdd] = useState<IProduct>({
    documentId: "",
    title: "",
    description: "",
    price: 0,
    stock: 0,
    category: {
      title: "",
    },
    thumbnail: {
      url: "",
    },
  });
  const [updateThumbnail, setUpdateThumbnail] = useState<File>();

  // Handlers
  const deleteProductHandler = (documentId: string) => {
    onOpen();
    setClickedProduct(documentId);
  };

  const onChangeUpdateHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProductToUpdate((prev) => ({ ...prev, [name]: value }));
  };

  const onChangeUpdateThumbnailHandler = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files?.[0]);
    setUpdateThumbnail(e.target.files?.[0]);
  };

  const onChangeAddHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProductToAdd((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedCategory = categories?.data.find(
      (cat) => cat.documentId === selectedId,
    );

    if (!selectedCategory) return;

    setProductToAdd((prev) => ({
      ...prev,
      category: selectedCategory,
    }));
  };

  const [updateProduct] = useUpdateProductMutation();

  const onSubmitUpdateHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !productToUpdate.documentId ||
      !productToUpdate.title ||
      !productToUpdate.description
    ) {
      toast({
        title: "Missing required fields",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    // 1. Get Strapi numeric ID from documentId
    const res = await fetch(
      `http://localhost:1337/api/products?filters[documentId][$eq]=${productToUpdate.documentId}`,
    );
    const productRes = await res.json();
    const strapiId = productRes?.data?.[0]?.id;

    if (!strapiId) {
      toast({
        title: "Product not found",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    // 2. Upload thumbnail if exists
    if (updateThumbnail) {
      const uploadFormData = new FormData();
      uploadFormData.append("files", updateThumbnail);
      uploadFormData.append("ref", "api::product.product");
      uploadFormData.append("refId", strapiId);
      uploadFormData.append("field", "thumbnail");

      await fetch("http://localhost:1337/api/upload", {
        method: "POST",
        body: uploadFormData,
        headers: {
          Authorization: `Bearer ${CookieService.get("jwt")}`,
        },
      });
    }

    // 3. Update product info
    await updateProduct({
      productId: productToUpdate.documentId,
      data: {
        title: productToUpdate.title,
        description: productToUpdate.description,
        price: Number(productToUpdate.price),
        stock: Number(productToUpdate.stock),
        category: productToUpdate.category?.documentId as unknown as ICategory,
      },
    });

    toast({
      title: "Product Updated Successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    onCloseUpdateModal();
  };

  const [addProduct] = useAddProductMutation();

  const onSubmitAddHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Validate required fields
    if (
      !productToAdd.title ||
      !productToAdd.description ||
      !productToAdd.category?.documentId
    ) {
      toast({
        title: "Missing required fields",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    // 2. Generate new documentId
    const documentId = uuid(); // لازم تكون عامل import لـ uuid

    // 3. Get Strapi ID for category using its documentId
    const categoryRes = await fetch(
      `http://localhost:1337/api/categories?filters[documentId][$eq]=${productToAdd.category.documentId}`,
    );
    const categoryData = await categoryRes.json();
    const strapiCategoryId = categoryData?.data?.[0]?.id;

    if (!strapiCategoryId) {
      toast({
        title: "Category not found",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    // 4. Add product
    await addProduct({
      data: {
        title: productToAdd.title,
        description: productToAdd.description,
        price: Number(productToAdd.price),
        stock: Number(productToAdd.stock),
        category: strapiCategoryId,
        documentId,
      },
    }).unwrap();

    // 5. Success toast + close modal
    toast({
      title: "Product Added Successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    onCloseAddModal();
  };

  if (isDashboardProductLoading) return <TableSkeleton />;

  return (
    <Flex flexDir={"column"} gap={4} p={4}>
      <Button bg={"#0BC5EA"} color={"white"} onClick={onOpenAddModal}>
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
                    src={`${BASE_URL}${product.thumbnail?.url}`}
                    boxSize="60px"
                    borderRadius="md"
                    objectFit="cover"
                    flexShrink={0}
                  />
                </Td>
                <Td>{product?.price}</Td>
                <Td>{product?.stock}</Td>
                <Td>
                  <Button mr={2}>
                    <Eye />
                  </Button>
                  <Button
                    mr={2}
                    onClick={() =>
                      deleteProductHandler(product.documentId ?? "")
                    }
                    isLoading={isProductRemoveLoading}
                  >
                    <Trash2 />
                  </Button>
                  <Button
                    onClick={() => {
                      setClickedProduct(product.documentId ?? "");
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
      <AlertModal
        isOpen={isOpen}
        onClose={onClose}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        acceptTxt="Yes"
        rejectTxt="Cancel"
        onCLick={async () => {
          await deleteProduct(clickedProduct);
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
      <ModalDialog
        title="Update The Product"
        isOpen={isUpdateModalOpen}
        onClose={onCloseUpdateModal}
      >
        <form
          style={{ display: "flex", flexDirection: "column", gap: 15 }}
          onSubmit={onSubmitUpdateHandler}
        >
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              name="title"
              value={productToUpdate.title}
              onChange={onChangeUpdateHandler}
            />
            <FormErrorMessage>Enter A Valid Title</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={productToUpdate.description}
              onChange={onChangeUpdateHandler}
            />
            <FormErrorMessage>Enter A Valid Description</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Price</FormLabel>
            <NumberInput
              name="price"
              value={productToUpdate.price}
              onChange={(_valStr, valNum) => {
                setProductToUpdate((prev) => ({
                  ...prev,
                  price: valNum,
                }));
              }}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>Enter A Valid Price</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Stock</FormLabel>
            <NumberInput
              name="stock"
              value={productToUpdate.stock}
              onChange={(_valStr, valNum) => {
                setProductToUpdate((prev) => ({
                  ...prev,
                  stock: valNum,
                }));
              }}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>Enter A Valid Stock</FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel>Thumbnail</FormLabel>
            <Input
              type="file"
              id="thumbnail"
              accept="image/png, image/gif, image/jpeg"
              onChange={onChangeUpdateThumbnailHandler}
            />
          </FormControl>
          <ButtonGroup justifyContent={"end"}>
            <Button variant={"ghost"} onClick={onCloseUpdateModal}>
              Close
            </Button>
            <Button colorScheme="blue" type="submit">
              Update
            </Button>
          </ButtonGroup>
        </form>
      </ModalDialog>

      {/* This is a placeholder for any additional content or components you might want to add below the table */}
      <ModalDialog
        title="Add A Product"
        isOpen={isAddModalOpen}
        onClose={onCloseAddModal}
      >
        <form
          style={{ display: "flex", flexDirection: "column", gap: 15 }}
          onSubmit={onSubmitAddHandler}
        >
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              name="title"
              value={productToAdd.title}
              onChange={onChangeAddHandler}
            />
            <FormErrorMessage>Enter A Valid Title</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={productToAdd.description}
              onChange={onChangeAddHandler}
            />
            <FormErrorMessage>Enter A Valid Description</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!productToAdd.category}>
            <FormLabel>Category</FormLabel>
            <Select
              placeholder="Select category"
              onChange={handleCategoryChange}
              value={productToAdd.category}
            >
              {categories?.data?.map((category) => (
                <option key={category.documentId} value={category.documentId}>
                  {category.title}
                </option>
              ))}
            </Select>
            <FormErrorMessage>Enter A Category</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Price</FormLabel>
            <NumberInput
              name="price"
              value={productToAdd.price}
              onChange={(_valStr, valNum) => {
                setProductToAdd((prev) => ({
                  ...prev,
                  price: valNum,
                }));
              }}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>Enter A Valid Price</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Stock</FormLabel>
            <NumberInput
              name="stock"
              value={productToAdd.stock}
              onChange={(_valStr, valNum) => {
                setProductToAdd((prev) => ({
                  ...prev,
                  stock: valNum,
                }));
              }}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>Enter A Valid Stock</FormErrorMessage>
          </FormControl>
          <ButtonGroup justifyContent={"end"}>
            <Button variant={"ghost"} onClick={onCloseAddModal}>
              Close
            </Button>
            <Button colorScheme="blue" type="submit">
              Add
            </Button>
          </ButtonGroup>
        </form>
      </ModalDialog>
    </Flex>
  );
};

export default DashboardProductsTable;
