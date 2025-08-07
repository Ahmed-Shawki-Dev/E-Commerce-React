import { Spinner, Box } from "@chakra-ui/react";

const TableSkeleton = () => {
  return (
    <Box
      minH={"full"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Box>
  );
};

export default TableSkeleton;
