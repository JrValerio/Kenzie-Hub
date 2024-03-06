import { Route, Routes } from "react-router-dom";
import { HomePage } from "../../pages/HomePage/HomePage";
import { RegisterPage } from "../../pages/RegisterPage/RegisterPage";
import { UserPage } from "../../pages/UserPage/UserPage";
import { ErrorPage } from "../../pages/ErrorPage/ErrorPage";
import { PrivateRoutes } from "../PrivateRoutes/PrivateRoutes";
import { PublicRoutes } from "../PublicRoutes/PublicRoutes";

export const RouterMain = () => {
  return (
    <Routes>
      <Route element={<PublicRoutes />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<PrivateRoutes />}>
        <Route path="/user" element={<UserPage />} />
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};


