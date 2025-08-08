import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import ModalDialog from "../shared/Modal";
import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  useGetCategoriesQuery,
  useUpdateProductMutation,
} from "@/app/services/apiSlice";
import type { ICategory, IProduct } from "@/interfaces";
import CookieService from "@/services/CookieService";
import { axiosInstance } from "@/config/index.config";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  productToUpdate: IProduct;
  setProductToUpdate: React.Dispatch<React.SetStateAction<IProduct>>;
}

const UpdateModal = ({
  onClose,
  isOpen,
  productToUpdate,
  setProductToUpdate,
}: IProps) => {
  const toast = useToast();

  const [updateThumbnail, setUpdateThumbnail] = useState<File>();

  const [updateProduct, { isLoading }] = useUpdateProductMutation();

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

  const { data: categories } = useGetCategoriesQuery();

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedCategory = categories?.data.find(
      (cat) => cat.documentId === selectedId,
    );
    if (!selectedCategory) return;
    setProductToUpdate((prev) => ({
      ...prev,
      category: selectedCategory,
    }));
  };

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
    const res = await axiosInstance.get(
      `/products?filters[documentId][$eq]=${productToUpdate.documentId}`,
    );
    const strapiId = res?.data?.data?.[0]?.id;

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

    onClose();
  };

  return (
    <>
      <ModalDialog title="Update The Product" isOpen={isOpen} onClose={onClose}>
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

          <FormControl isInvalid={!productToUpdate.category}>
            <FormLabel>Category</FormLabel>
            <Select
              placeholder="Select category"
              onChange={handleCategoryChange}
              value={productToUpdate?.category?.documentId ?? ""}
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
            <Button variant={"ghost"} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" type="submit" isLoading={isLoading}>
              Update
            </Button>
          </ButtonGroup>
        </form>
      </ModalDialog>
    </>
  );
};

export default UpdateModal;
