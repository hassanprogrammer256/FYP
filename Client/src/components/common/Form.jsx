import { buttonvariants } from '../../config';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Form = ({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
  isLoading,
  message,
  variant,
}) => {
  const renderInputsByComponentType = (getControlItem) => {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItem.name}
            className="flex w-full rounded border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;

      case "select":
        element = (
                   <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;

      default:
        element = (
         <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }

    return element;
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      {isLoading ? (
        <div className="w-full flex justify-center">
          <button
            className="w-full relative inline-flex justify-center items-center px-4 py-2 font-semibold border border-transparent rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            disabled
          >
            <div className="flex justify-center items-center">
              <div className="rounded-full border-2 border-green-700 animate-spin w-5 h-5 border-t-transparent mx-3"></div>
              {message ? (
                <span className="ml-3 text-black">{message}</span>
              ) : (
                'LOADING .....'
              )}
            </div>
          </button>
        </div>
      ) : (
        <div className="flex justify-center">
          <Button
            variant={variant}
            type="submit"
            disabled={isBtnDisabled}
            className={`${buttonvariants[variant]} px-4 py-2 rounded font-semibold focus:outline-none transition duration-200 my-3 w-[50%] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {buttonText}
          </Button>
        </div>
      )}
    </form>
  );
};

export default Form;