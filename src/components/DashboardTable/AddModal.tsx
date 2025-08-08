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
import { useState, type ChangeEvent } from "react";
import {
  useAddProductMutation,
  useGetCategoriesQuery,
} from "@/app/services/apiSlice";
import type { ICategory, IProduct } from "@/interfaces";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}
const AddModal = ({ isOpen, onClose }: IProps) => {
  const { data: categories } = useGetCategoriesQuery();
  const [productToAdd, setProductToAdd] = useState<IProduct>({
    title: "",
    description: "",
    price: 0,
    stock: 0,
    category: {
      title: "",
      documentId: "",
    },
  });
  const toast = useToast();
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

  const [addProduct, { isLoading }] = useAddProductMutation();

  const onSubmitAddHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    await addProduct({
      data: {
        title: productToAdd.title,
        description: productToAdd.description,
        price: Number(productToAdd.price),
        stock: Number(productToAdd.stock),
        category: productToAdd.category?.documentId as unknown as ICategory,
      },
    }).unwrap();

    toast({
      title: "Product Added Successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    onClose();
  };
  return (
    <>
      <ModalDialog title="Add A Product" isOpen={isOpen} onClose={onClose}>
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
              value={productToAdd?.category?.documentId ?? ""}
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
            <Button variant={"ghost"} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" type="submit" isLoading={isLoading}>
              Add
            </Button>
          </ButtonGroup>
        </form>
      </ModalDialog>
    </>
  );
};

export default AddModal;
