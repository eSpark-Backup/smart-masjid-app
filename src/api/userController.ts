import { api } from "."
import { userStore } from "../store/UserStore";


export const CreateUser = async (data: any) => {
    try {
        const result: any = await api.post('/users', data)
        console.log("result", result);
        userStore.userData.set(result)
        return true;
    } catch (error) {
        console.log("error", error);
    }
}