export const $ = <T extends Element>(selector: string, root: ParentNode = document): T | null => {
  return root.querySelector<T>(selector);
};

export const $$ = <T extends Element>(selector: string, root: ParentNode = document): T[] => {
  return Array.from(root.querySelectorAll<T>(selector));
};
