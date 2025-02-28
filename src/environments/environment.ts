export const environment = {
  production: false,
  base: typeof window !== 'undefined' && (window as any)["env"]?.URL_BACK
    ? (window as any)["env"].URL_BACK
    : ''
};
