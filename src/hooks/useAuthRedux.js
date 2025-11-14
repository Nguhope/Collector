
// src/hooks/useAuthRedux.js
import { useDispatch, useSelector } from 'react-redux';
import {useForgetPasswordMutation, useGetTokenQuery, useLoginMutation, useLogoutMutation, useResetPasswordMutation} from '../services/api/authApi'
import { setCredentials, clearCredentials, setError, setLoading } from '../features/auth/authSlice';

export const useAuthRedux = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);


  const [loginApi] = useLoginMutation();
  const [logoutApi] = useLogoutMutation();
  const [forgetPasswordApi] = useForgetPasswordMutation();
  const [resetPasswordApi] = useResetPasswordMutation();
  // const [getTokenApi] = useGetTokenQuery();

  // const getToken = async (credentials) => {
  //   try {
  //     dispatch(setLoading(true));
  //     const result =  await getTokenApi(credentials).unwrap();
  //   }
  // };
 

  const login = async (credentials) => {
    try {
      dispatch(setLoading(true));
      const result = await loginApi(credentials).unwrap();
     
      dispatch(setLoading(false));
      return result;
    } catch (err) {
      dispatch(setError(err.data?.message || 'Erreur inconnue'));
      dispatch(setLoading(false));
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutApi().unwrap();
    } finally {
      dispatch(clearCredentials());
    }
  };


  const forgetPassword= async (credentials) =>  {
        
        try {
          dispatch(setLoading(true));
         const result = await forgetPasswordApi(credentials).unwrap();
         return result;
        } catch (err) {
          dispatch(setError(err.data?.error || 'Erreur inconnu lors du reset Password'))
          dispatch(setLoading(false));
          throw err;
        }

  }

  const resetPassword = async (credentials) => {

    try {
      dispatch(setLoading(true))
      const result = await resetPasswordApi(credentials).unwrap();
      return result;
    } catch (err) {
        dispatch(setError(err.data?.error || 'Erreur inconnu lors du final reset Password'))
          dispatch(setLoading(false));
          throw err;
    }
  }



  return {
    ...auth,
    login,
    logout,
    forgetPassword,
    resetPassword,
  };
};
