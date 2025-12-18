import Mitt from "@/utils/mitt"

export function useMitt(namespace?: string) {
  return new Mitt(namespace)
}
