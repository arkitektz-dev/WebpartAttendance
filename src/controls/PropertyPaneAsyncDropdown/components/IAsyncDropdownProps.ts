import { IDropdownOption } from "office-ui-fabric-react/lib/components/Dropdown";

export interface IAsyncDropdownProps {
  label: string;
  loadOptions: () => Promise<IDropdownOption[]>;
  onChange: (option: IDropdownOption, index?: number) => void;
  selectedKey: string | number;
  disabled: boolean;
  stateKey: string;
  helpText: string;
}
