import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  rejectTxt: string;
  acceptTxt: string;
  onCLick: () => void;
  isLoading?:boolean
}

export default function AlertModal({
  onClose,
  isOpen,
  title,
  description,
  acceptTxt = "yes",
  rejectTxt = "cancel",
  onCLick: onClick,
  isLoading 
}: IProps) {
  const cancelRef = useRef(null);

  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>{title}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>{description}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              {rejectTxt}
            </Button>
            <Button colorScheme="red" ml={3} onClick={onClick} isLoading={isLoading}>
              {acceptTxt}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
