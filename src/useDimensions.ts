import React from "react";

// https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
// https://stackoverflow.com/questions/59873782/how-would-you-correctly-set-up-a-typescript-declaration-when-using-usecallback
export function useDimensions() {
  const [dimensions, setDimensions] = React.useState<ClientRect | null>(null);

  const ref = React.useCallback((node: HTMLElement | null) => {
    if (node !== null) {
      setDimensions(node.getBoundingClientRect());
      console.log(node.getBoundingClientRect());
    }
  }, []);

  return [dimensions, ref] as const;
}
