export namespace Context {
  export type ContextType = string;

  export type ContextValue = {
    id?: string;
    type: ContextType;
    content: string;
    score?: number;
  };

  export type ContextResult = ContextValue[];
}
