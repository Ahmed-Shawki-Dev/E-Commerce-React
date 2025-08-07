import {
  Input,
  InputGroup,
  type InputGroupProps,
  Button,
  type ButtonProps,
  InputRightAddon,
} from "@chakra-ui/react";
import { useRef, useState } from "react";

interface FilePickerProps {
  onFileChange: (files: File[]) => void;
  placeholder: string;
  clearButtonLabel?: string;
  hideClearButton?: boolean;
  multipleFiles?: boolean;
  inputProps?: InputGroupProps;
  inputGroupProps?: InputGroupProps;
  buttonProps?: ButtonProps;
}

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const FilePicker = ({
  onFileChange,
  placeholder,
  clearButtonLabel = "Clear Image",
  hideClearButton = false,
  multipleFiles = false,
  inputProps,
  inputGroupProps,
  buttonProps,
}: FilePickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files).filter((file) =>
      ALLOWED_IMAGE_TYPES.includes(file.type),
    );

    if (filesArray.length === 0) {
      setFileName("");
      onFileChange([]);
      clearInputValue();
      return;
    }

    setFileName(filesArray.map((f) => f.name).join(" & "));
    onFileChange(filesArray);
    clearInputValue();
  };

  const handleClear = () => {
    setFileName("");
    clearInputValue();
    onFileChange([]);
  };

  const handleInputClick = () => {
    clearInputValue();
    inputRef.current?.click();
  };

  const clearInputValue = () => {
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <InputGroup {...inputGroupProps}>
      <input
        type="file"
        ref={inputRef}
        multiple={multipleFiles}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
        data-testid={inputProps?._placeholder ?? placeholder}
      />
      <Input
        placeholder={placeholder}
        value={fileName}
        isReadOnly
        onClick={handleInputClick}
        {...inputProps}
      />
      {!hideClearButton && fileName && (
        <InputRightAddon>
          <Button {...buttonProps} onClick={handleClear}>
            {clearButtonLabel}
          </Button>
        </InputRightAddon>
      )}
    </InputGroup>
  );
};

export default FilePicker;
