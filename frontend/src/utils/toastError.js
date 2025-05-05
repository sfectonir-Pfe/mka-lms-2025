import { Bounce, toast } from "react-toastify";
export default function showErrorToast(mgs) {
    toast.error(mgs, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
        });
}
