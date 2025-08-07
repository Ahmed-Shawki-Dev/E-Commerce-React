import { fetchLoginData } from "@/app/features/LoginSlice";
import type { AppDispatch, RootState } from "@/app/store";
import { loginValidation } from "@/validation";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const LoginPage = () => {
  const bgColor = useColorModeValue("white", "#0D0B12");
  const boxColor = useColorModeValue("white", "#1d1b26");

  const [user, setUser] = useState({ identifier: "", password: "" });
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.login);
  const [loginError, setLoginError] = useState({
    identifier: "",
    password: "",
  });
  const [isEmail, setIsEmail] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    setIsEmail(false);
    setIsPassword(false);
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errorMsg = loginValidation(user);
    setLoginError(errorMsg);
    if (errorMsg.identifier || errorMsg.password) {
      setIsEmail(!!errorMsg.identifier);
      setIsPassword(!!errorMsg.password);
      return;
    }

    setIsEmail(false);
    setIsPassword(false);

    await dispatch(fetchLoginData(user));

    return;
  };

  return (
    <Flex minH={"100vh"} align={"center"} justify={"center"} bg={bgColor}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Log in to your account</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={boxColor}
          boxShadow={"lg"}
          p={8}
          as="form"
          onSubmit={onSubmitHandler}
        >
          <Stack spacing={4}>
            <FormControl id="identifier" isInvalid={isEmail}>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                name="identifier"
                value={user.identifier}
                onChange={onChangeHandler}
              />
              <FormErrorMessage>{loginError.identifier}</FormErrorMessage>
            </FormControl>

            <FormControl id="password" isInvalid={isPassword}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={user.password}
                  onChange={onChangeHandler}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{loginError.password}</FormErrorMessage>
            </FormControl>

            <Stack spacing={10}>
              <Button
                bg={"blue.400"}
                color={"white"}
                _hover={{ bg: "blue.500" }}
                type="submit"
              >
                {isLoading ? "Loading..." : "Log in"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default LoginPage;
