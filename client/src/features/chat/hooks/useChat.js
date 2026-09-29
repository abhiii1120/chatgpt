import { logout } from "@/features/auth/state/authThunk"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router";

export let useChat = () => {

    let dispatch = useDispatch();
    let navigate = useNavigate();

    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/')
    }

    return {
        handleLogout
    }
}