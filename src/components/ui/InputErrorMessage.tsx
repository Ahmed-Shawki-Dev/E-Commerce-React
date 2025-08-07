import { Text } from "@chakra-ui/react";

interface IProps {
  msg?: string;
}

const InputErrorMessage = ({ msg }: IProps) => {
  return msg ? (
    <Text color="red.700" px="0" pt="0" fontSize="sm">
      {msg}
    </Text>
  ) : null;
};

export default InputErrorMessage;
