import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import type { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  onClose: () => void;
  isOpen: boolean;
  title: string;
}

export default function ModalDialog({
  children,
  title,
  isOpen,
  onClose,
}: IProps) {
  return (
    <>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>

        </ModalContent>
      </Modal>
    </>
  );
}
