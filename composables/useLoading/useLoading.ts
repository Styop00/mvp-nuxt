import { ref } from 'vue';

const isLoading = ref<boolean>(false);  

export function useLoading() {
  function setLoading(value: boolean): void {
    isLoading.value = value;

  }
  return {
    isLoading,
    setLoading,
  };
}
