import { defineStore } from 'pinia';
import { reactive } from 'vue';

type Loaders = {
  image: boolean;
  common: boolean;
};

type LoaderType = 'image' | 'common';

type Args = {
  type: LoaderType;
  state: boolean;
};

export const useLoaderStore = defineStore('loaderStore', () => {
  //loading states
  const loaders = reactive<Loaders>({
    image: false,
    common: false,
  });

  //actions
  const toggleLoader = (args: Args) => {
    loaders[args.type] = args.state;
  };

  return {
    loaders,
    toggleLoader,
  };
});

export default useLoaderStore;
