type Address = { address: string; city: string };
type PresentDeliveryList<T> = {
  [P in keyof T]: Address;
};
