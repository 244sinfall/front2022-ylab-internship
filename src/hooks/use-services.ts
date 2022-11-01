import {useContext} from "react";
import {ServicesContext} from "@src/provider";
import Services from "@src/services";

/**
 * Хук для доступа к менеджеру сервисов
 * @return {Services}
 */
export default function useServices(){
  return useContext(ServicesContext) as Services;
}
