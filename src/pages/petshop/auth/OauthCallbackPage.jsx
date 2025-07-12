import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { loginSuccess, setToken, updateUserBusinessStatus } from '../../../store/slices/authSlice';
import { fetchMyBusiness } from '../../../store/slices/businessSlice';
import { getProfile, setRole } from '../../../api/authApi';
import { toast } from 'react-toastify';

const OAuthCallbackPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ searchParams ] = useSearchParams()
  
  
  useEffect(() => {
      console.log(searchParams, 'cek params');
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    console.log(params, 'cek param oauth');
    
    const userId = params.get("userId");

    if (!token || !userId) {
      navigate("/signin");
      return;
    }

    localStorage.setItem("token", token);
    dispatch(setToken(token));

    const fetchUser = async () => {
      try {
        const resProfile1 = await getProfile(userId);

        if(resProfile1.data.role !== 'BUSINESS_OWNER'){
          const resSetRole = await setRole(resProfile1.data.email)
          console.log(resSetRole, '<<< cek response set role');
        }

        const resProfile2 = await getProfile(userId)
        const user = resProfile2.data;
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(loginSuccess({ user, token }));

        // Fetch business
        const businessAction = await dispatch(fetchMyBusiness());
        if (businessAction.payload) {
          dispatch(updateUserBusinessStatus(true));
        } else {
          dispatch(updateUserBusinessStatus(false));
        }
        toast.success("Welcome! You're signed in with Google.");
        navigate("/");
      } catch (error) {
        console.error("OAuth failed:", error);
        toast.error("Google sign-in failed. Please try again.");
        navigate("/signin");
      }
    };

    fetchUser();
  }, [dispatch, navigate]);

  return <p className="text-center mt-32">Signing you in via Google...</p>;
};

export default OAuthCallbackPage;