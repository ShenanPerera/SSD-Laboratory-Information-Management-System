import { useEffect, useState } from "react";
import { useAdminLogin } from '../../hooks/useAdminLogin'
import { useLocation, useNavigate } from "react-router-dom";
import useUserPreferenceStore from "../../store/useUserPreferenceStore";
import { generateCodeChallenge, generateCodeVerifier} from "../../UtillFuntions/pkceUtils";
import fetchPermissionsAfterLogIn from "../../UtillFuntions/fetchPermissionsAfterLogIn";
import Permission from "../../UtillFuntions/Permission";
import Cookies from 'js-cookie';
import { AuthContextProvider } from "../../context/AuthContext";

const AdminLogin = () =>{
    const [username,setUser] = useState('')
    const [pw,setPW] =useState('')
    const {login ,error,isLoading} = useAdminLogin()
    const {accessToken , setAccessToken} = useUserPreferenceStore()
    const navigate = useNavigate();
    // const location = useLocation();
    // const code = new URLSearchParams(location.search).get('code'); 
    // console.log('code:', code);
    const [codeVerifier, setCodeVerifier] = useState(null);
    const [codeChallenge, setCodeChallenge] = useState(null);
       
    const handleSubmit = async(e) =>{
        e.preventDefault()

        await login(username,pw)

    }

    useEffect(() => {
        if(accessToken){
            navigate('/AdminProfile')
        }
    }, [accessToken , navigate])

    const handleGoogleLogin = async () => {     
        if(!codeVerifier || !codeChallenge){
            const code_verifier = generateCodeVerifier();
            const code_challenge = await generateCodeChallenge(code_verifier);

            console.log('Before Authorization:');
            console.log('code_verifier:', codeVerifier);
            console.log('code_challenge:', codeChallenge)

            Cookies.set('code_verifier', code_verifier,{ expires:5/(60*24) , sameSite:'Lax' , path: '/'});
            Cookies.set('code_challenge', code_challenge,{ expires:5/(60*24) , secure: true, sameSite:'Lax' , path: '/'});

            window.location.href = `${process.env.REACT_APP_AUTH_URL}?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URL}&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20openid&code_challenge=${code_challenge}&code_challenge_method=S256`;
        }
    }
        
    // useEffect(()=>{
    //     if(code && codeVerifier){
    //         console.log('code and codeVerifier:', code, codeVerifier);
    //         fetchAccessToken(code, codeVerifier)
    //             .then((token) => {
    //                 setAccessToken(token);
    //                 console.log(token);
                 
    //             }).catch((error) => 
    //                 {
    //                     console.error(error);
    //                 });
    //     }
    //  }, [code, codeVerifier, setAccessToken]);

    // api.js
    // const fetchAccessToken = async (code, codeVerifier) => {
    //     console.log(code, codeVerifier);
    //     const response = await fetch(`${process.env.REACT_APP_TOKEN_URL}`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded',
    //         },
    //         body: new URLSearchParams({
    //         grant_type: 'authorization_code',
    //         code: code,
    //         redirect_uri: process.env.REACT_APP_REDIRECT_URL,
    //         client_id: process.env.REACT_APP_CLIENT_ID,
    //         code_verifier: codeVerifier,
    //     }),

    // });
  
    // console.log('Token response status:', response.status);

    // if (!response.ok) {
    //   throw new Error('Failed to fetch access token');
    // }
  
    // const data = await response.json();
    // fetchUserInfo(data.access_token);
    // }

    // const fetchUserInfo = async (accessToken) => {
    //     console.log('fetchUserInfo', accessToken);
    //     const response = await fetch(`${process.env.REACT_APP_USERINFO_URL}`, {
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`,
    //       },
    //     });
      
    //     if (!response.ok) {
    //       throw new Error('Failed to fetch user info');
    //     }
      
    //     const data = await response.json();
    //     console.log(data);
        
    //     const isAdmin = await getUserByEmail(data.email);
    //     if(isAdmin){
    //         console.log(accessToken, isAdmin);
    //         Cookies.set('accessToken', accessToken,{ expires:7 , secure: true, sameSite:'None' , path: '/'});
    //         Cookies.set('isAdmin', isAdmin,{ expires:7, secure: true, sameSite:'None' , path: '/'});

    //         console.log(Cookies.get('accessToken'));

    //         AuthContextProvider.setOAuthUser(isAdmin);

    //         fetchPermissionsAfterLogIn({
    //             fetchFunction: async () => {
    //                 return [Permission.ADMIN];
    //             },
    //             afterSet: (permissions) => {
    //                 console.log('permissions:', permissions);
    //             },
    //         });
    //         navigate('/AdminProfile')
    //     }
    //     else{
    //         navigate('/')
    //     }
    // }

    // const getUserByEmail = async (email) => {
    //     const response = await fetch('/api/Admin/getAdminByEmail',{
    //         method: 'POST',
    //         headers: {'Content-Type': 'application/json'},
    //         body: JSON.stringify({email})
    //     })
    //     if (!response.ok) {
    //         throw new Error('Failed to fetch user info');
    //     }
    //     const data = await response.json();
    //     console.log(data);
    //     return data.username;
    // }

    return(
        <div>
            <div className="mb-4">
                <form className="create" onSubmit={handleSubmit}>
                    <h3>Admin Login</h3>

                    <label>Username:</label>
                    <input
                        type="text"
                        onChange={(e) => setUser(e.target.value)}
                        value={username}  
                    />
                    <label>Password:</label>
                    <input
                        type="password"
                        onChange={(e) => setPW(e.target.value)}
                        value={pw}  
                    />
                    <br/>

                    <button className="btnSubmit" disabled={isLoading}>Login</button>
                    {error && <div className="error">{error}</div>}
                </form>
            </div>
            <div style={{ textAlign: 'center' }}>
                <p>OR</p>
                <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-700">
                    <button className="flex items-center bg-white dark:bg-gray-900 border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    onClick={handleGoogleLogin}>
                        <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="-0.5 0 48 48" version="1.1"> 
                            <title>Google-color</title> 
                            <desc>Created with Sketch.</desc> 
                            <defs> </defs> 
                            <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> 
                                <g id="Color-" transform="translate(-401.000000, -860.000000)"> 
                                    <g id="Google" transform="translate(401.000000, 860.000000)"> 
                                        <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"> </path> 
                                        <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"> </path> 
                                        <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"> </path> 
                                        <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"> </path> 
                                    </g> 
                                </g> 
                            </g> 
                        </svg>
                        <span className="m-2">Continue with Google</span>
                    </button>
                </div>
            </div>
        </div>
    )



}

export default AdminLogin