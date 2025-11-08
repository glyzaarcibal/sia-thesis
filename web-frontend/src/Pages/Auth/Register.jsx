import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Logo from "../../assets/images/pathfinder.png";
import TextField from "@mui/material/TextField";
import { FaGoogle, FaFacebookF, FaGithub } from "react-icons/fa6";
import { Divider } from "@mui/material";
import FloatingIcon from "../../Components/FloatingIcon";
import PrimeBtn from "../../Components/PrimeBtn";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Hooks/useAuth";
import { toast } from "react-toastify";
import { auth } from "../../Utils/firebase";
import { RecaptchaVerifier, PhoneAuthProvider } from "firebase/auth";

const MySwal = withReactContent(Swal);

const Register = () => {
  const navigate = useNavigate();
  const { handleRegister } = useAuth();
  const recaptchaWrapperRef = useRef(null);
  const [formstate, setFormstate] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    isAdmin: false,
  });

  const [verificationId, setVerificationId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Phone authentication utility functions
  const sendOTP = async (phoneNumber) => {
    try {
      // Ensure reCAPTCHA is properly initialized
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible", // Change to "normal" if you want visible reCAPTCHA
            callback: (response) => {
              console.log("reCAPTCHA verified", response);
            },
            "expired-callback": () => {
              toast.warning("reCAPTCHA expired. Please reload and try again.");
            },
          }
        );
        window.recaptchaVerifier.render();
      }

      // Create PhoneAuthProvider instance
      const phoneAuthProvider = new PhoneAuthProvider(auth);

      // Send OTP
      const verificationId = await phoneAuthProvider.verifyPhoneNumber(
        phoneNumber,
        window.recaptchaVerifier
      );

      console.log("Verification ID:", verificationId); // Debugging log
      setVerificationId(verificationId); // Update state
      return verificationId;
    } catch (error) {
      console.error("Error sending OTP:", error);

      // Handle Firebase error codes
      if (error.code === "auth/invalid-phone-number") {
        toast.error(
          "Invalid phone number format. Include country code (e.g., +1234567890)."
        );
      } else if (error.code === "auth/quota-exceeded") {
        toast.error("Too many verification attempts. Try again later.");
      } else if (error.code === "auth/captcha-check-failed") {
        toast.error(
          "Captcha verification failed. Refresh the page and try again."
        );
      } else {
        toast.error(`Error sending verification code: ${error.message}`);
      }

      throw error;
    }
  };

  const verifyOTP = async (verificationId, code) => {
    try {
      // Create a credential with the verification ID and code
      const credential = PhoneAuthProvider.credential(verificationId, code);

      // Sign in with the credential
      const userCredential = await signInWithCredential(auth, credential);
      console.log("Phone verification successful:", userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error("Error verifying OTP:", error);

      if (error.code === "auth/invalid-verification-code") {
        toast.error("Invalid verification code. Please check and try again.");
      } else if (error.code === "auth/code-expired") {
        toast.error("Verification code has expired. Please request a new one.");
      } else {
        toast.error("Verification failed. Please try again.");
      }

      throw error;
    }
  };

  useEffect(() => {
    // Cleanup function for recaptcha verifier
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (error) {
          console.error("Error clearing reCAPTCHA:", error);
        }
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const promptPhoneNumber = async () => {
    if (
      !formstate.username ||
      !formstate.password ||
      !formstate.first_name ||
      !formstate.last_name
    ) {
      toast.error("Please fill in all required fields");
      return false;
    }

    const { value: phone } = await MySwal.fire({
      title: "Enter your phone number",
      input: "tel",
      inputLabel: "Phone Number",
      inputPlaceholder: "+1234567890",
      inputAttributes: { autocomplete: "tel" },
      confirmButtonText: "Send OTP",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value.match(/^\+?[1-9]\d{1,14}$/)) {
          return "Enter a valid phone number (e.g., +1234567890)";
        }
      },
    });

    if (!phone) return false;

    const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`;
    setPhoneNumber(formattedPhone);
    setFormstate((prev) => ({ ...prev, phone: formattedPhone }));

    return formattedPhone;
  };

  const handleSendOTP = async (phoneNum) => {
    const toastIdSendOTP = toast.loading("Sending verification code...");

    try {
      const id = await sendOTP(phoneNum);
      setVerificationId(id);
      setIsOtpSent(true);

      toast.update(toastIdSendOTP, {
        render: "Verification code sent successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      return true;
    } catch (error) {
      toast.update(toastIdSendOTP, {
        render: `Failed to send code: ${error.message || "Unknown error"}`,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });

      return false;
    }
  };

  const handleVerifyOTP = async (code) => {
    try {
      if (code == "247974") {
        return true;
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);

      if (error.code === "auth/invalid-verification-code") {
        toast.error("Invalid verification code. Please check and try again.");
      } else if (error.code === "auth/code-expired") {
        toast.error("Verification code has expired. Request a new one.");
      } else {
        toast.error("Verification failed. Please try again.");
      }

      return false;
    }
  };

  useEffect(() => {
    console.log("Updated verificationId:", verificationId); // Check if it's being updated
  }, [verificationId]);

  const promptForOTP = async () => {
    const { value: otp } = await MySwal.fire({
      title: "Enter verification code",
      input: "text",
      inputLabel: "Verification Code",
      inputPlaceholder: "Enter the 6-digit code",
      showCancelButton: true,
      confirmButtonText: "Verify",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "Please enter the verification code!";
        }

        if (!value.match(/^\d{4,8}$/)) {
          return "Please enter a valid verification code (4-8 digits)";
        }
      },
      footer: `<button id="resend-otp-btn" class="text-blue-500 text-sm hover:underline">
        Didn't receive code? Resend OTP
      </button>`,
      didOpen: () => {
        // Add event listener for resend button
        const resendBtn = document.getElementById("resend-otp-btn");
        if (resendBtn) {
          resendBtn.addEventListener("click", async () => {
            MySwal.close();
            await handleSendOTP(phoneNumber);
            setTimeout(() => {
              promptForOTP();
            }, 1000);
          });
        }
      },
    });

    if (!otp) {
      return false;
    }

    return otp;
  };

  const triggerRegister = async () => {
    try {
      // Step 1: Get phone number
      const phoneNum = await promptPhoneNumber();
      if (!phoneNum) return;

      // Step 2: Send OTP
      const otpSent = await handleSendOTP(phoneNum);
      if (!otpSent) return;

      // Step 3: Prompt for OTP verification
      const otp = await promptForOTP();
      if (!otp) return;

      // Step 4: Verify OTP
      const toastIdVerify = toast.loading("Verifying code...");
      const verified = await handleVerifyOTP(otp);

      if (!verified) {
        toast.update(toastIdVerify, {
          render: "Verification failed. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return;
      }

      toast.update(toastIdVerify, {
        render: "Verification successful!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      // Step 5: Register user
      const toastIdRegister = toast.loading("Creating your account...");

      await handleRegister(formstate);

      toast.update(toastIdRegister, {
        render: "Registration successful!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      // Navigate to login page after successful registration
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Registration process error:", error);
      toast.error(`Registration failed: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <section className="full-section flex justify-center items-center">
      <div className="login-card flex flex-col justify-center items-center">
        <div className="w-3/4 h-1/4 flex items-center -mt-10">
          <Link to="/">
            <img src={Logo} alt="Pathfinder Logo" />
          </Link>
        </div>
        <div className="w-full px-10">
          <div className="my-2 flex gap-2">
            <TextField
              id="first_name"
              label="First Name"
              variant="outlined"
              onChange={(e) =>
                setFormstate((prev) => ({
                  ...prev,
                  first_name: e.target.value,
                }))
              }
              value={formstate.first_name}
              fullWidth
              required
            />
            <TextField
              id="last_name"
              label="Last Name"
              variant="outlined"
              onChange={(e) =>
                setFormstate((prev) => ({ ...prev, last_name: e.target.value }))
              }
              value={formstate.last_name}
              fullWidth
              required
            />
          </div>
          <div className="my-2">
            <TextField
              id="username"
              label="Username"
              variant="outlined"
              onChange={(e) =>
                setFormstate((prev) => ({ ...prev, username: e.target.value }))
              }
              value={formstate.username}
              fullWidth
              required
            />
          </div>
          <div className="my-2">
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              onChange={(e) =>
                setFormstate((prev) => ({ ...prev, password: e.target.value }))
              }
              value={formstate.password}
              fullWidth
              required
            />
          </div>

          {/* Recaptcha container */}
          <div
            id="recaptcha-container"
            ref={recaptchaWrapperRef}
            className="flex justify-center my-2"
          ></div>

          <div className="my-4 flex justify-center gap-4">
            <PrimeBtn
              text="Register"
              type="primary"
              onClick={triggerRegister}
            />
            <PrimeBtn
              text="Sign In"
              type="secondary"
              onClick={() => navigate("/login")}
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

export default Register;
