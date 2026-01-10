import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";

// Typed versions (recommended)
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector;
