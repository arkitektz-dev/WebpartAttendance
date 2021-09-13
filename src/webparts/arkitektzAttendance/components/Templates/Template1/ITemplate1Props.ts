import { IReadonlyTheme } from "@microsoft/sp-component-base";

export interface ITemplate1Props {
  showDescription: boolean;
  description: string;
  themeVariant: IReadonlyTheme | undefined;
  children: any;
}
