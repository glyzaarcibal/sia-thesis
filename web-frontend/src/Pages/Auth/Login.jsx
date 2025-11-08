import React, { useEffect, useState } from "react";
import Logo from "../../assets/images/pathfinder.png";
import TextField from "@mui/material/TextField";
import { FaGoogle, FaFacebookF, FaGithub } from "react-icons/fa6";
import { Divider } from "@mui/material";
import FloatingIcon from "../../Components/FloatingIcon";
import PrimeBtn from "../../Components/PrimeBtn";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setName } from "../../Redux/Slice/AuthSlice";
import { useAuth } from "../../Hooks/useAuth";

const Login = () => {
  const [formstate, setFormstate] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { handleLogin } = useAuth();

  const loginTrigger = () => {
    handleLogin(formstate);
  };

  return (
    <section className="full-section flex justify-center items-center">
      <div className="login-card flex flex-col justify-center items-center">
        <div className="w-3/4 h-1/4 flex items-center -mt-10">
          <Link to="/">
            <img src={Logo} />
          </Link>
        </div>
        <div className="w-full px-10">
          <div className="my-2">
            <TextField
              id="username"
              label="User"
              variant="outlined"
              value={formstate.username}
              onChange={(e) =>
                setFormstate((prev) => ({ ...prev, username: e.target.value }))
              }
              fullWidth
            />
          </div>
          <div className="my-2">
            <TextField
              id="password"
              type="password"
              label="Password"
              variant="outlined"
              value={formstate.password}
              onChange={(e) =>
                setFormstate((prev) => ({ ...prev, password: e.target.value }))
              }
              fullWidth
            />
          </div>
          <div className="my-4 flex justify-center gap-4">
            <PrimeBtn text="Sign In" type="primary" onClick={loginTrigger} />
            <PrimeBtn
              text="Register"
              type="secondary"
              onClick={() => navigate("/register")}
            />
          </div>
          <Divider className="text-gray-500 text-xs" textAlign="center">
            or continue with
          </Divider>
          <div className="flex justify-center gap-2 mt-2">
            <FloatingIcon icon={FaGoogle} />
            <FloatingIcon icon={FaFacebookF} />
            <FloatingIcon icon={FaGithub} />
          </div>
          <div className="mt-5"></div>
        </div>
      </div>
    </section>
  );
};

export default Login;
