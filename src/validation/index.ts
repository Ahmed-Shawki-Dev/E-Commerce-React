import type { ILoginData } from "@/interfaces";
import * as yup from "yup";
export const loginValidation = ({ identifier, password }: ILoginData) => {
  const errorObj = {
    identifier: "",
    password: "",
  };
  if (!identifier.trim() || identifier.length === 0) {
    errorObj.identifier = "Invalid Email";
  }
  if (!password.trim() || password.length === 0) {
    errorObj.password = "Invalid Password";
  }

  return errorObj;
};

export const editProductSchema = yup.object({
  title: yup.string().required("Enter A Title To Edit"),

  categories: yup
    .array()
    .of(
      yup.object({
        title: yup.string().required("Enter Category Title"),
        documentId: yup.string().optional(),
        id: yup.number().optional(),
      }),
    )
    .min(1, "Enter At Least One Category")
    .required("Category is required"),

  price: yup.number().required("Price is required"),
  stock: yup.number().required("Stock is required"),
});
